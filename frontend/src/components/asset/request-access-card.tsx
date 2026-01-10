
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Copy, 
  CheckCircle2, 
  Mail, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { TokenDetails } from '@/hooks/useTokenDetails';

interface RequestAccessCardProps {
  tokenDetails: TokenDetails;
  tokenAddress: `0x${string}`;
}

export function RequestAccessCard({ tokenDetails, tokenAddress }: RequestAccessCardProps) {
  const [copied, setCopied] = useState(false);
  const { name, kycRequired, isUserWhitelisted, isOwner } = tokenDetails;

  // Don't show if user is already whitelisted or is the owner
  if (isUserWhitelisted || isOwner) {
    return null;
  }

  // Don't show if KYC is not required (open access)
  if (!kycRequired) {
    return null;
  }

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!', {
      description: 'Share this with the issuer to request access.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactIssuer = () => {
    // In production, this would open a form or redirect to a KYC provider
    toast.info('Contact Issuer', {
      description: 'In production, this would open a KYC verification flow or contact form.',
    });
  };

  return (
    <Card className="glass-card border-amber-500/30 overflow-hidden">
      {/* Gradient Banner */}
      <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-300">
          <UserPlus className="w-5 h-5" />
          Request Investment Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Explanation */}
        <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <p className="text-sm text-gray-300 leading-relaxed">
            This asset requires <strong className="text-amber-300">KYC verification</strong> before you can invest. 
            This ensures regulatory compliance and protects all investors.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">How to invest:</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-400">1</span>
              </div>
              <div>
                <p className="text-sm text-white">Contact the issuer</p>
                <p className="text-xs text-gray-500">Share your wallet address and verify your identity</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-400">2</span>
              </div>
              <div>
                <p className="text-sm text-white">Get whitelisted</p>
                <p className="text-xs text-gray-500">The issuer will add you to the approved investor list</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white">Start investing</p>
                <p className="text-xs text-gray-500">Receive tokens and earn yield distributions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex-1 border-amber-500/50 hover:bg-amber-500/10 text-amber-300"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button
            onClick={handleContactIssuer}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Issuer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-gray-500 text-center">
          By requesting access, you agree to complete the required KYC/AML verification process.
        </p>
      </CardContent>
    </Card>
  );
}
