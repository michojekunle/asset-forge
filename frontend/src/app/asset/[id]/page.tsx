
'use client';

import { useParams } from 'next/navigation';
import { useTokenDetails } from '@/hooks/useTokenDetails';
import { YieldCard } from '@/components/asset/yield-card';
import { CompliancePanel } from '@/components/asset/compliance-panel';
import { InvestorPortfolioCard } from '@/components/asset/investor-portfolio-card';
import { AssetVerificationCard } from '@/components/asset/asset-verification-card';
import { PropertyDetailsCard } from '@/components/asset/property-details-card';
import { RequestAccessCard } from '@/components/asset/request-access-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, FileText, Share2, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  const { name, symbol, assetType, isOwner } = tokenDetails;
  const displayType = assetType || 'Unknown';

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Back Navigation */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            {isRealEstate ? (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{name || 'Asset'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/50">
                  {symbol || 'SYM'}
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-300">
                  {displayType}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/50 py-1.5 px-3">
              Issuer View
            </Badge>
          )}
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-white/5"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Contract Address Bar */}
      <div className="mb-8 p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Contract:</span>
          <code className="text-sm text-gray-300 font-mono">{id}</code>
        </div>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(id);
            toast.success('Contract address copied!');
          }}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Asset Info */}
        <div className="space-y-6">
          <AssetVerificationCard tokenDetails={tokenDetails} tokenAddress={id} />
          {isRealEstate && <PropertyDetailsCard tokenDetails={tokenDetails} />}
        </div>

        {/* Right Column - User Actions */}
        <div className="space-y-6">
          <InvestorPortfolioCard tokenDetails={tokenDetails} />
          
          {/* Yield Card - Only for Real Estate tokens */}
          {isRealEstate && <YieldCard tokenAddress={id} isOwner={isOwner} />}
          
          {/* Request Access - Only for non-whitelisted users */}
          <RequestAccessCard tokenDetails={tokenDetails} tokenAddress={id} />
        </div>
      </div>

      {/* Owner/Issuer Section */}
      {isOwner && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Issuer Controls
          </h2>
          <CompliancePanel tokenAddress={id} />
        </div>
      )}
    </div>
  );
}
