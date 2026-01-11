"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeployedAsset } from "@/types/asset";
import { ASSET_TYPES, formatAddress, formatNumber, getMantleExplorerUrl, copyToClipboard } from "@/lib/utils";
import { ExternalLink, Share2, MoreHorizontal, Copy, Eye, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface AssetCardProps {
  asset: DeployedAsset;
  index?: number;
  onDelete?: (address: string) => void;
}

export function AssetCard({ asset, index = 0, onDelete }: AssetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const assetTypeInfo = ASSET_TYPES[asset.assetType.toUpperCase() as keyof typeof ASSET_TYPES];
  const isTestnet = asset.chainId === 5003;

  const handleShare = async () => {
    const url = `${window.location.origin}/asset/${asset.address}`;
    await copyToClipboard(url);
    setCopied(true);
    toast.success('Link copied!', {
      description: 'Share this link with potential investors.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAddress = async () => {
    await copyToClipboard(asset.address);
    toast.success('Contract address copied!');
    setMenuOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(asset.address);
    }
    setMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative"
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
              <span className="font-medium text-white">
                {formatNumber(parseFloat(asset.totalSupply) / Math.pow(10, asset.decimals))}
              </span>
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
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleShare}
              className="hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
                className={menuOpen ? "bg-white/5" : ""}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setMenuOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 bottom-full mb-2 w-48 py-2 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50"
                    >
                      <Link
                        href={`/asset/${asset.address}`}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Eye className="h-4 w-4" />
                        View Asset
                      </Link>
                      <button
                        onClick={handleCopyAddress}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Address
                      </button>
                      <a
                        href={getMantleExplorerUrl("address", asset.address, isTestnet)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Explorer
                      </a>
                      {onDelete && (
                        <>
                          <div className="my-1 border-t border-neutral-800" />
                          <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove from List
                          </button>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
