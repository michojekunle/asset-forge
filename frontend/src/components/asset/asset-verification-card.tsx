
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  FileCheck, 
  Users, 
  ExternalLink, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import { TokenDetails } from '@/hooks/useTokenDetails';

interface AssetVerificationCardProps {
  tokenDetails: TokenDetails;
  tokenAddress: `0x${string}`;
}

export function AssetVerificationCard({ tokenDetails, tokenAddress }: AssetVerificationCardProps) {
  const { owner, kycRequired, assetType } = tokenDetails;

  const explorerUrl = `https://sepolia.mantlescan.xyz/address/${tokenAddress}`;
  const ownerExplorerUrl = `https://sepolia.mantlescan.xyz/address/${owner}`;

  return (
    <Card className="glass-card border-blue-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-300">
          <ShieldCheck className="w-5 h-5" />
          Verification & Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compliance Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">KYC Requirement</span>
          </div>
          {kycRequired ? (
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Enforced
            </Badge>
          ) : (
            <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50">
              Not Required
            </Badge>
          )}
        </div>

        {/* Asset Type */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Asset Classification</span>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/50">
            {assetType}
          </Badge>
        </div>

        {/* Oracle Verification (Simulated) */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Data Verification</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Appraisal Oracle</span>
              <Badge variant="outline" className="text-amber-400 border-amber-500/50 text-[10px]">
                <AlertTriangle className="w-2 h-2 mr-1" />
                Pending Integration
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Ownership Proof</span>
              <Badge variant="outline" className="text-amber-400 border-amber-500/50 text-[10px]">
                <AlertTriangle className="w-2 h-2 mr-1" />
                Pending Integration
              </Badge>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            Chainlink Functions integration will enable automated verification of off-chain data.
          </p>
        </div>

        {/* Links */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <span className="text-sm text-gray-400 group-hover:text-white">View Contract</span>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
          </a>
          <a
            href={ownerExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <span className="text-sm text-gray-400 group-hover:text-white">View Issuer</span>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
