
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { REAL_ESTATE_TOKEN_ABI } from '@/contracts/abi';
import { parseEther } from 'viem';

export function useRealEstateToken(tokenAddress: `0x${string}`, userAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read: Pending Reward
  const { data: pendingReward, refetch: refetchPending } = useReadContract({
    address: tokenAddress,
    abi: REAL_ESTATE_TOKEN_ABI,
    functionName: 'viewPendingReward',
    args: userAddress ? [userAddress] : undefined,
    query: {
     enabled: !!userAddress,
    }
  });

  // Write: Claim Reward
  const claimReward = () => {
    writeContract({
      address: tokenAddress,
      abi: REAL_ESTATE_TOKEN_ABI,
      functionName: 'claimReward',
    });
  };

  // Write: Deposit Rent (Owner only)
  const depositRent = (amount: string) => {
    writeContract({
      address: tokenAddress,
      abi: REAL_ESTATE_TOKEN_ABI,
      functionName: 'depositRent',
      value: parseEther(amount),
    });
  };

  return {
    pendingReward,
    refetchPending,
    claimReward,
    depositRent,
    isPending: isWritePending || isConfirming,
    isSuccess: isConfirmed,
    hash,
    error: writeError,
  };
}
