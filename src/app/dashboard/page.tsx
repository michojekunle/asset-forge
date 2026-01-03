"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Plus, Search, Grid, List, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AssetCard } from "@/components/dashboard/asset-card";
import { DeployedAsset } from "@/types/asset";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockAssets: DeployedAsset[] = [
  {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Manhattan Tower Token",
    symbol: "MTT",
    assetType: "real_estate",
    totalSupply: "1000000",
    decimals: 18,
    owner: "0xabcd...1234",
    deployedAt: Date.now() - 86400000 * 2,
    txHash: "0xabc123",
    chainId: 5003,
  },
  {
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "Corporate Bond 2027",
    symbol: "CB27",
    assetType: "bond",
    totalSupply: "500000",
    decimals: 6,
    owner: "0xabcd...1234",
    deployedAt: Date.now() - 86400000 * 5,
    txHash: "0xdef456",
    chainId: 5003,
  },
  {
    address: "0x567890abcdef1234567890abcdef123456789012",
    name: "Tech Invoice #1024",
    symbol: "INV1024",
    assetType: "invoice",
    totalSupply: "50000",
    decimals: 18,
    owner: "0xabcd...1234",
    deployedAt: Date.now() - 86400000,
    txHash: "0xghi789",
    chainId: 5003,
  },
];

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter assets based on search and type
  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || asset.assetType === filterType;
    return matchesSearch && matchesType;
  });

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <Card variant="glass" className="max-w-lg mx-auto text-center">
          <CardContent className="py-16 px-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Connect your wallet to view your deployed assets and manage your portfolio.
            </p>
            <Button variant="primary" size="lg" className="px-10">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Assets</h1>
            <p className="text-lg text-muted-foreground">
              Manage your deployed RWA tokens on Mantle
            </p>
          </div>
          <Link href="/create">
            <Button variant="primary" size="lg" className="px-8">
              <Plus className="h-5 w-5 mr-2" />
              Create New Asset
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <Card variant="default">
            <CardContent className="py-8">
              <p className="text-base text-muted-foreground mb-2">Total Assets</p>
              <p className="text-4xl font-bold">{mockAssets.length}</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="py-8">
              <p className="text-base text-muted-foreground mb-2">Total Value Locked</p>
              <p className="text-4xl font-bold">$1.55M</p>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent className="py-8">
              <p className="text-base text-muted-foreground mb-2">Network</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="w-3 h-3 rounded-full bg-warning" />
                <p className="text-xl font-semibold">Mantle Sepolia</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14"
            />
          </div>
          <div className="flex items-center gap-4">
            {/* Type Filters */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-muted">
              {["all", "real_estate", "bond", "invoice"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === "all" ? null : type)}
                  className={cn(
                    "px-5 py-3 rounded-lg text-base font-medium transition-colors",
                    (type === "all" && !filterType) || filterType === type
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {type === "all" ? "All" : type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-muted">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            )}
          >
            {filteredAssets.map((asset, index) => (
              <AssetCard key={asset.address} asset={asset} index={index} />
            ))}
          </div>
        ) : (
          <Card variant="glass" className="text-center py-20">
            <CardContent>
              <div className="text-5xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold mb-4">No assets found</h3>
              <p className="text-lg text-muted-foreground mb-10">
                {searchQuery
                  ? "No assets match your search criteria"
                  : "You haven't created any assets yet"}
              </p>
              <Link href="/create">
                <Button variant="primary" size="lg" className="px-10">
                  <Plus className="h-5 w-5 mr-2" />
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
