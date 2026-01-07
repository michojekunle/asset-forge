"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { ASSET_FACTORY_ABI, ERC20_ABI } from "@/contracts/abi";
import { CONTRACT_ADDRESSES } from "@/config/wagmi";

export interface UserAsset {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  balance: bigint;
  assetType: string;
  owner: string;
}

interface UseUserAssetsReturn {
  assets: UserAsset[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching user's deployed tokens from AssetFactory
 */
export function useUserAssets(): UseUserAssetsReturn {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();

  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!address || !publicClient || !chainId) {
      setAssets([]);
      return;
    }

    const factoryAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.assetFactory;
    if (!factoryAddress || factoryAddress === "0x0000000000000000000000000000000000000000") {
      // Factory not deployed - return empty instead of error
      setAssets([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get user's asset addresses from factory
      const assetAddresses = await publicClient.readContract({
        address: factoryAddress as `0x${string}`,
        abi: ASSET_FACTORY_ABI,
        functionName: "getAssetsByCreator",
        args: [address],
      }) as `0x${string}`[];

      if (!assetAddresses || assetAddresses.length === 0) {
        setAssets([]);
        return;
      }

      // Fetch details for each asset
      const assetDetails = await Promise.all(
        assetAddresses.map(async (assetAddress) => {
          try {
            const [name, symbol, decimals, totalSupply, balance, owner, assetType] = await Promise.all([
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
                functionName: "balanceOf",
                args: [address],
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

            return {
              address: assetAddress,
              name: name as string,
              symbol: symbol as string,
              decimals: decimals as number,
              totalSupply: totalSupply as bigint,
              balance: balance as bigint,
              owner: owner as string,
              assetType: assetType as string,
            };
          } catch {
            // Skip assets that fail to load
            return null;
          }
        })
      );

      const validAssets = assetDetails.filter(Boolean) as UserAsset[];
      setAssets(validAssets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
    } finally {
      setIsLoading(false);
    }
  }, [address, publicClient, chainId]);

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
