// Asset creation form types

export type AssetType = "real_estate" | "bond" | "invoice" | "custom";

export interface AssetDetails {
  name: string;
  symbol: string;
  description: string;
  // Real Estate specific
  propertyAddress?: string;
  propertyType?: string;
  appraisalValue?: string;
  // Bond specific
  faceValue?: string;
  interestRate?: string;
  maturityDate?: string;
  // Invoice specific
  invoiceNumber?: string;
  dueDate?: string;
  invoiceAmount?: string;
  debtor?: string;
}

export interface Tokenomics {
  totalSupply: string;
  decimals: number;
  initialMintAddress: string;
  mintable: boolean;
  burnable: boolean;
  pausable: boolean;
}

export interface Compliance {
  kycRequired: boolean;
  accreditedOnly: boolean;
  transferRestrictions: boolean;
  jurisdictions: string[];
  assetBackedBy: string;
  legalDocumentUrl: string;
}

export interface AssetFormData {
  assetType: AssetType;
  details: AssetDetails;
  tokenomics: Tokenomics;
  compliance: Compliance;
}

export const initialFormData: AssetFormData = {
  assetType: "real_estate",
  details: {
    name: "",
    symbol: "",
    description: "",
  },
  tokenomics: {
    totalSupply: "1000000",
    decimals: 18,
    initialMintAddress: "",
    mintable: true,
    burnable: true,
    pausable: false,
  },
  compliance: {
    kycRequired: false,
    accreditedOnly: false,
    transferRestrictions: false,
    jurisdictions: [],
    assetBackedBy: "",
    legalDocumentUrl: "",
  },
};

// Deployed asset type
export interface DeployedAsset {
  address: string;
  name: string;
  symbol: string;
  assetType: AssetType;
  totalSupply: string;
  decimals: number;
  owner: string;
  deployedAt: number;
  txHash: string;
  chainId: number;
  metadata?: {
    description?: string;
    propertyAddress?: string;
    interestRate?: string;
    maturityDate?: string;
  };
}
