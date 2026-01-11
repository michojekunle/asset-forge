
'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTokenDetails } from '@/hooks/useTokenDetails';
import { YieldCard } from '@/components/asset/yield-card';
import { CompliancePanel } from '@/components/asset/compliance-panel';
import { InvestorPortfolioCard } from '@/components/asset/investor-portfolio-card';
import { AssetVerificationCard } from '@/components/asset/asset-verification-card';
import { PropertyDetailsCard } from '@/components/asset/property-details-card';
import { RequestAccessCard } from '@/components/asset/request-access-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ArrowLeft, Building2, FileText, Share2, Copy, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function AssetDetailPage() {
  const params = useParams();
  const id = params?.id as `0x${string}`;
  const [copied, setCopied] = useState(false);

  const { tokenDetails, isRealEstate, isLoading } = useTokenDetails(id);

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = `https://sepolia.mantlescan.xyz/address/${id}`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading asset details..." />
      </div>
    );
  }

  const { name, symbol, assetType, isOwner } = tokenDetails;
  const displayType = assetType || 'Unknown';

  return (
    <div className="min-h-screen">
      {/* Hero Background Gradient */}
      <div className="absolute inset-x-0 top-0 h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 pt-8 pb-20 max-w-6xl">
        {/* Back Navigation */}
        <motion.div {...fadeIn} transition={{ delay: 0 }}>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-neutral-500 hover:text-white mb-8 transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Asset Icon */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                  isRealEstate 
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {isRealEstate ? (
                    <Building2 className="w-8 h-8 text-white" />
                  ) : (
                    <FileText className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Asset Title */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {isOwner && (
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] uppercase tracking-wider">
                      Issuer
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  {name || 'Asset'}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 font-mono text-sm px-3">
                    ${symbol || 'SYM'}
                  </Badge>
                  <Badge className="bg-white/5 text-neutral-400 border border-white/10">
                    {displayType}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    On-Chain
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5 hover:border-white/20"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 hover:bg-white/5 hover:border-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Contract Address Bar */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <div className="mb-10 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <span className="text-emerald-400 text-xs font-bold">CA</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">Contract Address</span>
                <code className="text-sm text-neutral-300 font-mono">{id}</code>
              </div>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(id);
                toast.success('Contract address copied!');
              }}
              variant="ghost"
              size="sm"
              className="text-neutral-500 hover:text-white hover:bg-white/5"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Asset Info */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="space-y-6">
            <AssetVerificationCard tokenDetails={tokenDetails} tokenAddress={id} />
            {isRealEstate && <PropertyDetailsCard tokenDetails={tokenDetails} />}
          </motion.div>

          {/* Right Column - User Actions */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="space-y-6">
            <InvestorPortfolioCard tokenDetails={tokenDetails} />
            
            {/* Yield Card - Only for Real Estate tokens */}
            {isRealEstate && <YieldCard tokenAddress={id} isOwner={isOwner} />}
            
            {/* Request Access - Only for non-whitelisted users */}
            <RequestAccessCard tokenDetails={tokenDetails} tokenAddress={id} />
          </motion.div>
        </div>

        {/* Owner/Issuer Section */}
        {isOwner && (
          <motion.div {...fadeIn} transition={{ delay: 0.5 }} className="mt-12">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 via-transparent to-transparent border border-amber-500/20">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                Issuer Controls
              </h2>
              <CompliancePanel tokenAddress={id} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
