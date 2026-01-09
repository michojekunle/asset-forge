
'use client';

import { useParams } from 'next/navigation';
import { useAccount, useReadContracts } from 'wagmi';
import { RWA_TOKEN_ABI } from '@/contracts/abi';
import { YieldCard } from '@/components/asset/yield-card';
import { CompliancePanel } from '@/components/asset/compliance-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AssetDetailPage() {
  const params = useParams();
  const id = params?.id as `0x${string}`;
  const { address: userAddress } = useAccount();

  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: id, abi: RWA_TOKEN_ABI, functionName: 'name' },
      { address: id, abi: RWA_TOKEN_ABI, functionName: 'symbol' },
      { address: id, abi: RWA_TOKEN_ABI, functionName: 'assetType' }, // e.g. "Real Estate", "Bond"
      { address: id, abi: RWA_TOKEN_ABI, functionName: 'owner' },
      { address: id, abi: RWA_TOKEN_ABI, functionName: 'totalSupply' },
      { address: id, abi: RWA_TOKEN_ABI, functionName: 'decimals' },
    ]
  });

  const [name, symbol, assetType, owner, totalSupply, decimals] = data?.map(r => r.result) || [];

  const isOwner = userAddress && owner && userAddress === owner;
  const isRealEstate = assetType === 'Real Estate' || assetType === 'real_estate'; 
  
  // formatted Asset Type for display
  const displayType = String(assetType || 'Unknown');

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading asset details...</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{String(name || 'Asset')}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/50">
              {String(symbol || 'SYM')}
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-300">
              {displayType}
            </Badge>
          </div>
        </div>
        {isOwner && (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50">
            Issuer View
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Info */}
        <Card className="glass-card md:col-span-2 p-5">
          <CardHeader>
            <CardTitle className="text-lg text-gray-300">Asset Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3 mt-2">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-sm text-gray-500">Total Supply</div>
              <div className="text-xl font-mono text-white">
                {totalSupply ? (Number(totalSupply) / 10 ** Number(decimals || 18)).toLocaleString() : '-'}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-sm text-gray-500">Token Type</div>
              <div className="text-xl text-white flex items-center gap-2">
                {isRealEstate ? <Building2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                {displayType}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-sm text-gray-500">Contract</div>
              <div className="text-xs font-mono text-gray-400 break-all">
                {id}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="md:col-span-2 space-y-6">
          {isRealEstate && (
            <YieldCard tokenAddress={id} isOwner={!!isOwner} />
          )}

          {isOwner && (
            <CompliancePanel tokenAddress={id} />
          )}
        </div>
      </div>
    </div>
  );
}
