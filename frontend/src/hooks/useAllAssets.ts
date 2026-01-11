"use client";

import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { ASSET_FACTORY_ABI, ERC20_ABI } from "@/contracts/abi";
import { CONTRACT_ADDRESSES, mantleSepolia } from "@/config/wagmi";
import { DeployedAsset } from "@/types/asset";

interface UseAllAssetsReturn {
  assets: DeployedAsset[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching ALL assets from AssetFactory (for showcase)
 */
export function useAllAssets(): UseAllAssetsReturn {
  const publicClient = usePublicClient();

  const [assets, setAssets] = useState<DeployedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!publicClient) {
      setAssets([]);
      setIsLoading(false);
      return;
    }

    const factoryAddress = CONTRACT_ADDRESSES[mantleSepolia.id]?.assetFactory;
    if (!factoryAddress || factoryAddress === "0x0000000000000000000000000000000000000000") {
      setAssets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get all asset addresses from factory
      const assetAddresses = await publicClient.readContract({
        address: factoryAddress as `0x${string}`,
        abi: ASSET_FACTORY_ABI,
        functionName: "getAllAssets",
      }) as `0x${string}`[];

      if (!assetAddresses || assetAddresses.length === 0) {
        setAssets([]);
        setIsLoading(false);
        return;
      }

      // Fetch details for each asset
      const assetDetails = await Promise.all(
        assetAddresses.map(async (assetAddress) => {
          try {
            const [name, symbol, decimals, totalSupply, owner, assetType] = await Promise.all([
              publicClient.readContract({
                address: assetAddress,
                abi: ERC20_ABI,
                functionName: "name",
              }),
              publicClient.readContract({
                address: assetAddress,
                abi: ERC20_ABI,
                functionName: "symbol",
              }),
              publicClient.readContract({
                address: assetAddress,
                abi: ERC20_ABI,
                functionName: "decimals",
              }),
              publicClient.readContract({
                address: assetAddress,
                abi: ERC20_ABI,
                functionName: "totalSupply",
              }),
              publicClient.readContract({
                address: assetAddress,
                abi: ERC20_ABI,
                functionName: "owner",
              }),
              publicClient.readContract({
                address: factoryAddress as `0x${string}`,
                abi: ASSET_FACTORY_ABI,
                functionName: "getAssetType",
                args: [assetAddress],
              }),
            ]);

            // Map asset type string to our format
            const typeStr = (assetType as string).toLowerCase();
            let mappedType = "custom";
            if (typeStr.includes("real") || typeStr.includes("estate")) mappedType = "real_estate";
            else if (typeStr.includes("bond")) mappedType = "bond";
            else if (typeStr.includes("invoice")) mappedType = "invoice";

            return {
              address: assetAddress,
              name: name as string,
              symbol: symbol as string,
              assetType: mappedType,
              totalSupply: (totalSupply as bigint).toString(),
              decimals: decimals as number,
              owner: owner as string,
              deployedAt: Date.now(), // We don't have this on-chain easily
              txHash: "",
              chainId: mantleSepolia.id,
            } as DeployedAsset;
          } catch {
            return null;
          }
        })
      );

      const validAssets = assetDetails.filter(Boolean) as DeployedAsset[];
      setAssets(validAssets);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    isLoading,
    error,
    refetch: fetchAssets,
  };
}
