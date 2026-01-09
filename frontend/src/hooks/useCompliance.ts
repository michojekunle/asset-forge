
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { RWA_TOKEN_ABI } from '@/contracts/abi';
import { toast } from 'sonner';

export function useCompliance(tokenAddress: `0x${string}`) {
  const publicClient = usePublicClient();
  const { writeContractAsync, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read: KYC Required?
  const { data: kycRequired } = useReadContract({
    address: tokenAddress,
    abi: RWA_TOKEN_ABI,
    functionName: 'kycRequired',
  });

  // Read: Is Whitelisted? (Helper to fetch for specific address)
  const checkIsWhitelisted = async (account: `0x${string}`) => {
    if (!publicClient) return false;
    try {
      const status = await publicClient.readContract({
        address: tokenAddress,
        abi: RWA_TOKEN_ABI,
        functionName: 'isWhitelisted',
        args: [account],
      });
      return status;
    } catch (e) {
      console.error("Error checking whitelist status:", e);
      return false;
    }
  };

  // Write: Update Whitelist
  const updateWhitelist = async (account: `0x${string}`, status: boolean) => {
    if (!publicClient) throw new Error("Public client not available");

    const txHash = await writeContractAsync({
      address: tokenAddress,
      abi: RWA_TOKEN_ABI,
      functionName: 'updateWhitelist',
      args: [account, status],
    });

    await publicClient.waitForTransactionReceipt({ hash: txHash });

    toast.success("Whitelist updated", {
      description: "Whitelist status updated successfully.",
    });
  };

  return {
    kycRequired,
    checkIsWhitelisted,
    updateWhitelist,
    isPending: isWritePending || isConfirming,
    isSuccess: isConfirmed,
    hash,
    error: writeError,
  };
}
