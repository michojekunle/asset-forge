
'use client';

import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, PieChart, ShieldCheck, ShieldAlert } from 'lucide-react';
import { TokenDetails } from '@/hooks/useTokenDetails';

interface InvestorPortfolioCardProps {
  tokenDetails: TokenDetails;
}

export function InvestorPortfolioCard({ tokenDetails }: InvestorPortfolioCardProps) {
  const { isConnected } = useAccount();
  const { userBalance, totalSupply, decimals, symbol, isUserWhitelisted, kycRequired, valuePerToken } = tokenDetails;

  if (!isConnected) {
    return (
      <Card className="glass-card border-gray-700/50">
        <CardContent className="p-6 text-center text-gray-400">
          <Wallet className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>Connect your wallet to view your holdings</p>
        </CardContent>
      </Card>
    );
  }

  const formattedBalance = Number(formatUnits(userBalance, decimals));
  const formattedSupply = Number(formatUnits(totalSupply, decimals));
  const ownershipPercentage = formattedSupply > 0 ? (formattedBalance / formattedSupply) * 100 : 0;

  // Estimated value in USD (valuePerToken is in cents)
  const estimatedValue = valuePerToken
    ? (formattedBalance * Number(valuePerToken)) / 100
    : null;

  return (
    <Card className="glass-card border-purple-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-purple-300">
          <Wallet className="w-5 h-5" />
          Your Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Whitelist Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
          <span className="text-sm text-gray-400">Verification Status</span>
          {kycRequired ? (
            isUserWhitelisted ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified Investor
              </Badge>
            ) : (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/50">
                <ShieldAlert className="w-3 h-3 mr-1" />
                Pending Verification
              </Badge>
            )
          ) : (
            <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50">
              Open Access
            </Badge>
          )}
        </div>

        {/* Balance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Wallet className="w-4 h-4" />
              Your Balance
            </div>
            <div className="text-2xl font-bold text-white">
              {formattedBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">{symbol}</div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <PieChart className="w-4 h-4" />
              Ownership
            </div>
            <div className="text-2xl font-bold text-white">
              {ownershipPercentage.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500">of total supply</div>
          </div>
        </div>

        {/* Estimated Value */}
        {estimatedValue !== null && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 border border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              Estimated Value
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ${estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">Based on appraisal value</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
