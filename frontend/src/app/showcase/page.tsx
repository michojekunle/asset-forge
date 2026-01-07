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
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-6">Community Showcase</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Discover RWA Tokens
          </h1>
          <p className="text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Explore tokenized real-world assets created by the community.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { label: "Total Assets", value: showcaseAssets.length },
            { label: "Creators", value: "12" },
            { label: "Total Value", value: "$67.4M" },
            { label: "This Week", value: "+4" },
          ].map((stat) => (
            <div key={stat.label} className="bg-neutral-900 rounded-2xl p-6 text-center">
              <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
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
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                  sortBy === option.id
                    ? "bg-white text-black"
                    : "bg-neutral-900 text-neutral-400 hover:text-white"
                )}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Type Filter Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 mb-10 overflow-x-auto pb-2"
        >
          <Filter className="h-4 w-4 text-neutral-500 flex-shrink-0" />
          {["all", "real_estate", "bond", "invoice", "custom"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type === "all" ? null : type)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                (type === "all" && !filterType) || filterType === type
                  ? "bg-white text-black"
                  : "bg-neutral-900 text-neutral-400 hover:text-white"
              )}
            >
              {type === "all"
                ? "All Types"
                : type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </motion.div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssets.map((asset, index) => (
              <AssetCard key={asset.address} asset={asset} index={index} />
            ))}
          </div>
        ) : (
          <Card variant="default" className="text-center py-16 px-8">
            <CardContent>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-white mb-2">No assets found</h3>
              <p className="text-sm text-neutral-400">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-neutral-900 rounded-3xl py-16 px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight">
              Ready to Create Your Own Asset?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Join the community and launch your tokenized real-world asset on Mantle.
            </p>
            <Link href="/create">
              <Button variant="primary" size="lg">
                Start Creating
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
