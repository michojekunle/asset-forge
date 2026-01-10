
import { useAccount, useReadContracts } from 'wagmi';
import { RWA_TOKEN_ABI, REAL_ESTATE_TOKEN_ABI } from '@/contracts/abi';

export interface TokenDetails {
  name: string;
  symbol: string;
  assetType: string;
  owner: `0x${string}`;
  totalSupply: bigint;
  decimals: number;
  kycRequired: boolean;
  isUserWhitelisted: boolean;
  userBalance: bigint;
  isOwner: boolean;
  // Real Estate specific
  propertyAddress?: string;
  propertyType?: string;
  appraisalValue?: bigint;
  lastAppraisalDate?: bigint;
  valuePerToken?: bigint;
}

export function useTokenDetails(tokenAddress: `0x${string}`) {
  const { address: userAddress } = useAccount();

  // Base token data
  const { data: baseData, isLoading: isLoadingBase, refetch: refetchBase } = useReadContracts({
    contracts: [
      { address: tokenAddress, abi: RWA_TOKEN_ABI, functionName: 'name' },
      { address: tokenAddress, abi: RWA_TOKEN_ABI, functionName: 'symbol' },
      { address: tokenAddress, abi: RWA_TOKEN_ABI, functionName: 'assetType' },
      { address: tokenAddress, abi: RWA_TOKEN_ABI, functionName: 'owner' },
      { address: tokenAddress, abi: RWA_TOKEN_ABI, functionName: 'totalSupply' },
      { address: tokenAddress, abi: RWA_TOKEN_ABI, functionName: 'decimals' },
      { address: tokenAddress, abi: RWA_TOKEN_ABI, functionName: 'kycRequired' },
    ],
  });

  // User-specific data
  const { data: userData, isLoading: isLoadingUser, refetch: refetchUser } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: RWA_TOKEN_ABI,
        functionName: 'isWhitelisted',
        args: userAddress ? [userAddress] : undefined,
      },
      {
        address: tokenAddress,
        abi: RWA_TOKEN_ABI,
        functionName: 'balanceOf',
        args: userAddress ? [userAddress] : undefined,
      },
    ],
    query: {
      enabled: !!userAddress,
    },
  });

  // Property info for Real Estate tokens
  const assetType = baseData?.[2]?.result as string | undefined;
  const isRealEstate = assetType === 'Real Estate' || assetType === 'real_estate';

  const { data: propertyData, isLoading: isLoadingProperty } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: REAL_ESTATE_TOKEN_ABI,
        functionName: 'getPropertyInfo',
      },
    ],
    query: {
      enabled: isRealEstate,
    },
  });

  // Parse base data
  const name = (baseData?.[0]?.result as string) || '';
  const symbol = (baseData?.[1]?.result as string) || '';
  const owner = (baseData?.[3]?.result as `0x${string}`) || '0x0';
  const totalSupply = (baseData?.[4]?.result as bigint) || BigInt(0);
  const decimals = (baseData?.[5]?.result as number) || 18;
  const kycRequired = (baseData?.[6]?.result as boolean) || false;

  // Parse user data
  const isUserWhitelisted = (userData?.[0]?.result as boolean) || false;
  const userBalance = (userData?.[1]?.result as bigint) || BigInt(0);
  const isOwner = userAddress ? userAddress.toLowerCase() === owner.toLowerCase() : false;

  // Parse property data
  const propertyInfo = propertyData?.[0]?.result as
    | [string, string, bigint, bigint, bigint]
    | undefined;

  const tokenDetails: TokenDetails = {
    name,
    symbol,
    assetType: assetType || 'Unknown',
    owner,
    totalSupply,
    decimals,
    kycRequired,
    isUserWhitelisted,
    userBalance,
    isOwner,
  };

  if (isRealEstate && propertyInfo) {
    tokenDetails.propertyAddress = propertyInfo[0];
    tokenDetails.propertyType = propertyInfo[1];
    tokenDetails.appraisalValue = propertyInfo[2];
    tokenDetails.lastAppraisalDate = propertyInfo[3];
    tokenDetails.valuePerToken = propertyInfo[4];
  }

  const refetch = () => {
    refetchBase();
    refetchUser();
  };

  return {
    tokenDetails,
    isRealEstate,
    isLoading: isLoadingBase || isLoadingUser || (isRealEstate && isLoadingProperty),
    refetch,
  };
}
