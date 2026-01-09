
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCompliance } from '@/hooks/useCompliance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, UserPlus, UserMinus } from 'lucide-react';

interface CompliancePanelProps {
  tokenAddress: `0x${string}`;
}

export function CompliancePanel({ tokenAddress }: CompliancePanelProps) {
  const [targetAddress, setTargetAddress] = useState('');
  const { kycRequired, updateWhitelist, isPending } = useCompliance(tokenAddress);

  const handleUpdate = async (status: boolean) => {
    if (!targetAddress.startsWith('0x')) return;
    await updateWhitelist(targetAddress as `0x${string}`, status);
    setTargetAddress('');
  };

  return (
    <Card className="glass-card mt-6 border-blue-500/30 p-5">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-blue-400">
          <ShieldCheck className="w-5 h-5" />
          Regulatory Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 mt-3">
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
          <div className="space-y-1">
            <Label className="text-base text-gray-200">KYC Requirement</Label>
            <p className="text-xs text-gray-500">
              {kycRequired ? 'Transfers are restricted to whitelisted addresses.' : 'Compliance checks are currently disabled.'}
            </p>
          </div>
          <Switch checked={kycRequired} disabled /> 
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300">Manage Whitelist</h4>
          <div className="flex gap-2">
            <Input 
              placeholder="Investor Address (0x...)" 
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="bg-black/20 border-white/10 font-mono"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={async () => await handleUpdate(true)}
              disabled={!targetAddress || isPending}
              className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Whitelist
            </Button>
            <Button 
              onClick={async () => await handleUpdate(false)}
              disabled={!targetAddress || isPending}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserMinus className="w-4 h-4 mr-2" />}
              Revoke
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
