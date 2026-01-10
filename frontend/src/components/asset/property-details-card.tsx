
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Home, DollarSign, Calendar } from 'lucide-react';
import { TokenDetails } from '@/hooks/useTokenDetails';
import { formatUnits } from 'viem';

interface PropertyDetailsCardProps {
  tokenDetails: TokenDetails;
}

export function PropertyDetailsCard({ tokenDetails }: PropertyDetailsCardProps) {
  const {
    propertyAddress,
    propertyType,
    appraisalValue,
    lastAppraisalDate,
    valuePerToken,
    decimals,
    totalSupply,
  } = tokenDetails;

  if (!propertyAddress) {
    return null;
  }

  // Format appraisal value (stored in cents)
  const formattedAppraisal = appraisalValue
    ? (Number(appraisalValue) / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      })
    : 'N/A';

  // Format value per token (stored in cents)
  const formattedValuePerToken = valuePerToken
    ? (Number(valuePerToken) / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
      })
    : 'N/A';

  // Format last appraisal date
  const formattedDate = lastAppraisalDate
    ? new Date(Number(lastAppraisalDate) * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  // Format total supply
  const formattedSupply = Number(formatUnits(totalSupply, decimals)).toLocaleString();

  return (
    <Card className="glass-card border-emerald-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-emerald-300">
          <Building2 className="w-5 h-5" />
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Address */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <MapPin className="w-4 h-4" />
            Property Address
          </div>
          <p className="text-white font-medium">{propertyAddress}</p>
        </div>

        {/* Property Type & Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-black/20 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Home className="w-3 h-3" />
              Property Type
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
              {propertyType || 'Unknown'}
            </Badge>
          </div>

          <div className="p-3 rounded-lg bg-black/20 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Calendar className="w-3 h-3" />
              Last Appraisal
            </div>
            <p className="text-sm text-white">{formattedDate}</p>
          </div>
        </div>

        {/* Valuation */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 border border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <DollarSign className="w-4 h-4" />
            Valuation
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Appraisal Value</div>
              <div className="text-2xl font-bold text-white">{formattedAppraisal}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Value Per Token</div>
              <div className="text-xl font-bold text-emerald-400">{formattedValuePerToken}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Tokens</span>
              <span className="text-white font-mono">{formattedSupply}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
