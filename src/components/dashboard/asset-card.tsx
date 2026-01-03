"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeployedAsset } from "@/types/asset";
import { ASSET_TYPES, formatAddress, formatNumber, getMantleExplorerUrl } from "@/lib/utils";
import { ExternalLink, Share2, MoreHorizontal } from "lucide-react";

interface AssetCardProps {
  asset: DeployedAsset;
  index?: number;
}

export function AssetCard({ asset, index = 0 }: AssetCardProps) {
  const assetTypeInfo = ASSET_TYPES[asset.assetType.toUpperCase() as keyof typeof ASSET_TYPES];
  const isTestnet = asset.chainId === 5003;

  const getGradient = () => {
    switch (asset.assetType) {
      case "real_estate":
        return "from-indigo-500 to-purple-500";
      case "bond":
        return "from-purple-500 to-pink-500";
      case "invoice":
        return "from-cyan-500 to-blue-500";
      default:
        return "from-green-500 to-emerald-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="glass" hover className="h-full flex flex-col p-0">
        <CardContent className="p-10 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center`}>
              <span className="text-2xl">{assetTypeInfo?.icon || "🪙"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isTestnet ? "warning" : "success"}>
                {isTestnet ? "Testnet" : "Mainnet"}
              </Badge>
            </div>
          </div>

          {/* Title & Symbol */}
          <h3 className="text-xl font-bold mb-2 truncate">{asset.name}</h3>
          <p className="text-base text-muted-foreground mb-6">${asset.symbol}</p>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Total Supply</span>
              <span className="font-semibold">{formatNumber(parseFloat(asset.totalSupply))}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="secondary">{assetTypeInfo?.name || "Custom"}</Badge>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Contract</span>
              <a
                href={getMantleExplorerUrl("address", asset.address, isTestnet)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-2"
              >
                {formatAddress(asset.address)}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border p-6 mt-auto">
          <div className="flex items-center gap-3 w-full">
            <Link href={`/asset/${asset.address}`} className="flex-1">
              <Button variant="secondary" size="lg" className="w-full">
                View Details
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
