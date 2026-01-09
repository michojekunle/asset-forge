
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useRealEstateToken } from '@/hooks/useRealEstateToken';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface YieldCardProps {
  tokenAddress: `0x${string}`;
  isOwner: boolean;
}

export function YieldCard({ tokenAddress, isOwner }: YieldCardProps) {
  const { address } = useAccount();
  const [rentAmount, setRentAmount] = useState('');
  
  const { 
    pendingReward, 
    claimReward, 
    depositRent, 
    isPending, 
    isSuccess 
  } = useRealEstateToken(tokenAddress, address);

  const handleDeposit = () => {
    if (!rentAmount) return;
    depositRent(rentAmount);
    setRentAmount('');
  };

  return (
    <Card className="glass-card mt-6 p-5">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Rental Yield
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 mt-3">
        <div className="p-4 rounded-lg bg-black/20 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Unclaimed Rewards</div>
            <div className="text-2xl font-bold text-white">
              {pendingReward ? Number(formatEther(pendingReward)).toFixed(6) : '0.00'} MNT
            </div>
            <Button 
              onClick={() => claimReward()} 
              disabled={!pendingReward || pendingReward === 0n || isPending}
              className="mt-4 w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Claim Rewards
            </Button>
        </div>

        {isOwner && (
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Distribute Rent (Owner)</h4>
            <div className="flex gap-2">
              <Input 
                placeholder="Amount (MNT)" 
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className="bg-black/20 border-white/10"
              />
              <Button 
                onClick={handleDeposit}
                disabled={!rentAmount || isPending}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50"
              >
                Deposit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
