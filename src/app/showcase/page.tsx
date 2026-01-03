"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, TrendingUp, Clock, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetCard } from "@/components/dashboard/asset-card";
import { DeployedAsset } from "@/types/asset";
import { cn } from "@/lib/utils";

// Mock community assets for showcase
const showcaseAssets: DeployedAsset[] = [
  {
    address: "0x1111111111111111111111111111111111111111",
    name: "Silicon Valley Office Complex",
    symbol: "SVOC",
    assetType: "real_estate",
    totalSupply: "5000000",
    decimals: 18,
    owner: "0xcreator1",
    deployedAt: Date.now() - 86400000 * 7,
    txHash: "0x111",
    chainId: 5003,
  },
  {
    address: "0x2222222222222222222222222222222222222222",
    name: "Green Energy Bond 2028",
    symbol: "GEB28",
    assetType: "bond",
    totalSupply: "10000000",
    decimals: 6,
    owner: "0xcreator2",
    deployedAt: Date.now() - 86400000 * 3,
    txHash: "0x222",
    chainId: 5003,
  },
  {
    address: "0x3333333333333333333333333333333333333333",
    name: "European Logistics Invoice",
    symbol: "ELI",
    assetType: "invoice",
    totalSupply: "250000",
    decimals: 18,
    owner: "0xcreator3",
    deployedAt: Date.now() - 86400000,
    txHash: "0x333",
    chainId: 5003,
  },
  {
    address: "0x4444444444444444444444444444444444444444",
    name: "Art Collection Token",
    symbol: "ACT",
    assetType: "custom",
    totalSupply: "100",
    decimals: 0,
    owner: "0xcreator4",
    deployedAt: Date.now() - 86400000 * 14,
    txHash: "0x444",
    chainId: 5003,
  },
  {
    address: "0x5555555555555555555555555555555555555555",
    name: "Miami Beach Condo",
    symbol: "MBC",
    assetType: "real_estate",
    totalSupply: "2000000",
    decimals: 18,
    owner: "0xcreator5",
    deployedAt: Date.now() - 86400000 * 10,
    txHash: "0x555",
    chainId: 5003,
  },
  {
    address: "0x6666666666666666666666666666666666666666",
    name: "Infrastructure Bond A",
    symbol: "INFRA",
    assetType: "bond",
    totalSupply: "50000000",
    decimals: 6,
    owner: "0xcreator6",
    deployedAt: Date.now() - 86400000 * 5,
    txHash: "0x666",
    chainId: 5003,
  },
];

const sortOptions = [
  { id: "newest", label: "Newest", icon: Clock },
  { id: "popular", label: "Popular", icon: TrendingUp },
  { id: "featured", label: "Featured", icon: Star },
];

export default function ShowcasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredAssets = showcaseAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || asset.assetType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="accent" className="mb-4">Community Showcase</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Discover <span className="gradient-text">RWA Tokens</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore tokenized real-world assets created by the community. Get inspired
            and see what&apos;s possible with Asset Forge.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Assets", value: showcaseAssets.length },
            { label: "Creators", value: "12" },
            { label: "Total Value", value: "$67.4M" },
            { label: "This Week", value: "+4" },
          ].map((stat) => (
            <Card key={stat.label} variant="default">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  sortBy === option.id
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {["all", "real_estate", "bond", "invoice", "custom"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type === "all" ? null : type)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                (type === "all" && !filterType) || filterType === type
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {type === "all"
                ? "All Types"
                : type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset, index) => (
              <AssetCard key={asset.address} asset={asset} index={index} />
            ))}
          </div>
        ) : (
          <Card variant="glass" className="text-center py-16">
            <CardContent>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No assets found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card variant="glow" className="py-12">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">
                Ready to Create Your Own Asset?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join the community and launch your tokenized real-world asset on Mantle.
              </p>
              <Link href="/create">
                <Button variant="primary" size="lg">
                  Start Creating
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
