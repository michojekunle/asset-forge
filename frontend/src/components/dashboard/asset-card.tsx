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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card variant="default" hover className="h-full flex flex-col p-6">
        <CardContent className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center">
              <span className="text-lg">{assetTypeInfo?.icon || "🪙"}</span>
            </div>
            <Badge variant={isTestnet ? "warning" : "success"}>
              {isTestnet ? "Testnet" : "Mainnet"}
            </Badge>
          </div>

          {/* Title & Symbol */}
          <h3 className="text-base font-semibold text-white mb-1 truncate tracking-tight">
            {asset.name}
          </h3>
          <p className="text-sm text-neutral-500 mb-5">${asset.symbol}</p>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Total Supply</span>
              <span className="font-medium text-white">{formatNumber(parseFloat(asset.totalSupply))}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Type</span>
              <span className="text-neutral-300">{assetTypeInfo?.name || "Custom"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Contract</span>
              <a
                href={getMantleExplorerUrl("address", asset.address, isTestnet)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {formatAddress(asset.address)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-neutral-800 pt-5 mt-5">
          <div className="flex items-center gap-2 w-full">
            <Link href={`/asset/${asset.address}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
