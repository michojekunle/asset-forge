"use client";

import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ASSET_FACTORY_ABI } from "@/contracts/abi";
import { CONTRACT_ADDRESSES } from "@/config/wagmi";
import { AssetFormData } from "@/types/asset";
import { parseUnits, parseEventLogs } from "viem";

interface DeploymentResult {
  tokenAddress: string;
  txHash: string;
}

interface UseAssetFactoryReturn {
  deployToken: (formData: AssetFormData) => Promise<DeploymentResult>;
  isDeploying: boolean;
  error: string | null;
}

/**
 * Hook for deploying RWA tokens via the AssetFactory contract
 */
export function useAssetFactory(): UseAssetFactoryReturn {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deployToken = useCallback(
    async (formData: AssetFormData): Promise<DeploymentResult> => {
      if (!address || !walletClient || !publicClient || !chainId) {
        console.log("Details invalid:", { address: !!address, walletClient: !!walletClient, publicClient: !!publicClient, chainId });
        throw new Error("Wallet not connected");
      }

      if (chainId !== 5003) {
         console.warn(`Incorrect chain ID: ${chainId}. Expected 5003 (Mantle Sepolia).`);
         throw new Error("Wrong network. Please switch to Mantle Sepolia.");
      }

      const factoryAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.assetFactory;
      
      if (!factoryAddress || factoryAddress === "0x0000000000000000000000000000000000000000") {
        throw new Error("Asset Factory not configured on this network");
      }

      setIsDeploying(true);
      setError(null);

      try {
        const { name, symbol, description } = formData.details;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { decimals, totalSupply } = formData.tokenomics;
        
        // Parse total supply with decimals
        const supply = parseUnits(totalSupply || "0", decimals);

        let txHash: `0x${string}`;

        // Deploy based on asset type - asset-specific fields are in details
        switch (formData.assetType) {
          case "real_estate": {
            const propertyAddress = formData.details.propertyAddress || "";
            const propertyType = formData.details.propertyType || "residential";
            const appraisalValue = BigInt(
              Math.floor(parseFloat(formData.details.appraisalValue || "0") * 100)
            ); // Convert to cents

            txHash = await walletClient.writeContract({
              address: factoryAddress as `0x${string}`,
              abi: ASSET_FACTORY_ABI,
              functionName: "deployRealEstateToken",
              args: [name, symbol, decimals, supply, propertyAddress, propertyType, appraisalValue],
            });
            break;
          }

          case "bond": {
            const faceValue = BigInt(
              Math.floor(parseFloat(formData.details.faceValue || "1000") * 100)
            );
            const interestRateBps = BigInt(
              Math.floor(parseFloat(formData.details.interestRate || "5") * 100)
            );
            const maturityDate = BigInt(
              Math.floor(new Date(formData.details.maturityDate || Date.now() + 31536000000).getTime() / 1000)
            );
            const couponFrequency = BigInt(2); // Semi-annual

            txHash = await walletClient.writeContract({
              address: factoryAddress as `0x${string}`,
              abi: ASSET_FACTORY_ABI,
              functionName: "deployBondToken",
              args: [name, symbol, decimals, supply, faceValue, interestRateBps, maturityDate, couponFrequency],
            });
            break;
          }

          case "invoice": {
            const invoiceNumber = formData.details.invoiceNumber || "";
            const debtor = formData.details.debtor || "";
            const invoiceAmount = BigInt(
              Math.floor(parseFloat(formData.details.invoiceAmount || "0") * 100)
            );
            const dueDate = BigInt(
              Math.floor(new Date(formData.details.dueDate || Date.now() + 2592000000).getTime() / 1000)
            );
            const discountRateBps = BigInt(200); // 2% discount rate

            txHash = await walletClient.writeContract({
              address: factoryAddress as `0x${string}`,
              abi: ASSET_FACTORY_ABI,
              functionName: "deployInvoiceToken",
              args: [name, symbol, decimals, supply, invoiceNumber, debtor, invoiceAmount, dueDate, discountRateBps],
            });
            break;
          }

          default: {
            // Custom/RWA token
            txHash = await walletClient.writeContract({
              address: factoryAddress as `0x${string}`,
              abi: ASSET_FACTORY_ABI,
              functionName: "deployRWAToken",
              args: [name, symbol, decimals, supply, formData.assetType, description || ""],
            });
            break;
          }
        }

        // Wait for transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        
        // Parse logs to find AssetDeployed event
        const logs = parseEventLogs({
          abi: ASSET_FACTORY_ABI,
          logs: receipt.logs,
          eventName: 'AssetDeployed',
        });
        
        // The first AssetDeployed log contains the token address
        const deployedLog = logs[0];
        const tokenAddress = deployedLog?.args.assetAddress || receipt.contractAddress || "";

        return {
          tokenAddress: tokenAddress as string,
          txHash,
        };
      } catch (err) {
        console.error("Deployment error:", err);
        const message = err instanceof Error ? err.message : "Deployment failed";
        setError(message);
        throw err;
      } finally {
        setIsDeploying(false);
      }
    },
    [address, walletClient, publicClient, chainId]
  );

  return {
    deployToken,
    isDeploying,
    error,
  };
}
