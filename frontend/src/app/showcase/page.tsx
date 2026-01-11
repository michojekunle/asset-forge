"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, TrendingUp, Clock, Star, Filter, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { AssetCard } from "@/components/dashboard/asset-card";
import { useAllAssets } from "@/hooks/useAllAssets";
import { cn } from "@/lib/utils";

const sortOptions = [
  { id: "newest", label: "Newest", icon: Clock },
  { id: "popular", label: "Popular", icon: TrendingUp },
  { id: "featured", label: "Featured", icon: Star },
];

export default function ShowcasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState<string | null>(null);

  const { assets, isLoading, refetch } = useAllAssets();

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || asset.assetType === filterType;
    return matchesSearch && matchesType;
  });

  // Count unique owners for "Creators" stat
  const uniqueCreators = new Set(assets.map(a => a.owner)).size;

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Background gradients */}
      <div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-60 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Community Showcase
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Discover RWA Tokens
          </h1>
          <p className="text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Explore tokenized real-world assets created by the community on Mantle.
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
            { label: "Total Assets", value: assets.length.toString() },
            { label: "Creators", value: uniqueCreators.toString() },
            { label: "Network", value: "Mantle" },
            { label: "Status", value: isLoading ? "Loading..." : "Live" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-6 text-center backdrop-blur-sm">
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

          {/* Refresh */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
            className="border-white/10"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                  sortBy === option.id
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black"
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
        {isLoading ? (
          <div className="py-20">
            <Loader size="lg" text="Loading assets from blockchain..." />
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssets.map((asset, index) => (
              <AssetCard key={asset.address} asset={asset} index={index} />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <Card variant="default" className="text-center py-16 px-8">
            <CardContent>
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-white mb-2">No assets yet</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Be the first to create a tokenized asset on Mantle!
              </p>
              <Link href="/create">
                <Button variant="primary">Create First Asset</Button>
              </Link>
            </CardContent>
          </Card>
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
          <div className="bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 border border-white/10 rounded-3xl py-16 px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight">
              Ready to Create Your Own Asset?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Join the community and launch your tokenized real-world asset on Mantle.
            </p>
            <Link href="/create">
              <Button variant="primary" size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                Start Creating
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
