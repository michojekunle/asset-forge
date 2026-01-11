"use client";

import { useState, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Grid, List, Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AssetCard } from "@/components/dashboard/asset-card";
import { DeployedAsset, AssetType } from "@/types/asset";
import { cn } from "@/lib/utils";
import { useUserAssets } from "@/hooks/useUserAssets";
import { formatUnits } from "viem";
import { mantleSepolia } from "@/config/wagmi";
import { Loader } from "@/components/ui/loader";

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { assets: userAssets, isLoading } = useUserAssets();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  // Map UserAsset to DeployedAsset
  const assets: DeployedAsset[] = useMemo(() => userAssets.map(asset => ({
    address: asset.address,
    name: asset.name,
    symbol: asset.symbol,
    assetType: asset.assetType as AssetType,
    totalSupply: formatUnits(asset.totalSupply, asset.decimals),
    decimals: asset.decimals,
    owner: asset.owner,
    deployedAt: 0, // Timestamp not stored on-chain in basic implementation
    txHash: "0x...", 
    chainId: chainId || mantleSepolia.id,
  })), [userAssets, chainId]);

  // Filter assets based on search and type
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || asset.assetType === filterType;
    return matchesSearch && matchesType;
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="default" className="max-w-sm mx-auto text-center p-10">
            <CardContent>
              <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-7 w-7 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3 tracking-tight">Connect Your Wallet</h2>
              <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                Connect your wallet to view your deployed assets and manage your portfolio.
              </p>
              <Button variant="primary" size="lg" className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">My Assets</h1>
            <p className="text-neutral-400">
              Manage your deployed RWA tokens on Mantle
            </p>
          </div>
          <Link href="/create">
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              Create New Asset
            </Button>
          </Link>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <div className="bg-neutral-900 rounded-2xl p-6">
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Total Assets</p>
            <p className="text-3xl font-semibold text-white">{assets.length}</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-6">
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Total Value Locked</p>
            <p className="text-3xl font-semibold text-white">-</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-6">
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">Network</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <p className="text-lg font-medium text-white">Mantle Sepolia</p>
            </div>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Type Filters */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-neutral-900">
              {["all", "real_estate", "bond", "invoice"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === "all" ? null : type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    (type === "all" && !filterType) || filterType === type
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  {type === "all" ? "All" : type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 p-1.5 rounded-xl bg-neutral-900">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Assets Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader/>
          </div>
        ) : filteredAssets.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-4"
            )}
          >
            {filteredAssets.map((asset, index) => (
              <AssetCard key={asset.address} asset={asset} index={index} />
            ))}
          </div>
        ) : (
          <Card variant="default" className="text-center py-16 px-8">
            <CardContent>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-white mb-2">No assets found</h3>
              <p className="text-sm text-neutral-400 mb-8">
                {searchQuery
                  ? "No assets match your search criteria"
                  : "You haven't created any assets yet"}
              </p>
              <Link href="/create">
                <Button variant="primary" size="md">
                  <Plus className="h-4 w-4" />
                  Create Your First Asset
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
