/**
 * Contract ABIs for Asset Forge
 * Auto-generated from compiled Solidity contracts
 */

// AssetFactory ABI - Factory for deploying RWA tokens
export const ASSET_FACTORY_ABI = [
  {
    type: "event",
    name: "AssetDeployed",
    inputs: [
      { name: "assetAddress", type: "address", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "assetType", type: "string", indexed: false },
      { name: "name", type: "string", indexed: false },
      { name: "symbol", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    name: "deployRWAToken",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "decimals", type: "uint8" },
      { name: "initialSupply", type: "uint256" },
      { name: "assetType", type: "string" },
      { name: "description", type: "string" },
    ],
    outputs: [{ type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployRealEstateToken",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "decimals", type: "uint8" },
      { name: "initialSupply", type: "uint256" },
      { name: "propertyAddress", type: "string" },
      { name: "propertyType", type: "string" },
      { name: "appraisalValue", type: "uint256" },
    ],
    outputs: [{ type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployBondToken",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "decimals", type: "uint8" },
      { name: "initialSupply", type: "uint256" },
      { name: "faceValue", type: "uint256" },
      { name: "interestRateBps", type: "uint256" },
      { name: "maturityDate", type: "uint256" },
      { name: "couponFrequency", type: "uint256" },
    ],
    outputs: [{ type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployInvoiceToken",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "decimals", type: "uint8" },
      { name: "initialSupply", type: "uint256" },
      { name: "invoiceNumber", type: "string" },
      { name: "debtor", type: "string" },
      { name: "invoiceAmount", type: "uint256" },
      { name: "dueDate", type: "uint256" },
      { name: "discountRateBps", type: "uint256" },
    ],
    outputs: [{ type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllAssets",
    inputs: [],
    outputs: [{ type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAssetsByCreator",
    inputs: [{ name: "creator", type: "address" }],
    outputs: [{ type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAssetType",
    inputs: [{ name: "asset", type: "address" }],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAssetCount",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAssetsDeployed",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

// ERC20 Token ABI (basic read functions)
export const ERC20_ABI = [
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ type: "address" }],
    stateMutability: "view",
  },
] as const;

// RWA Token ABI (extended info)
export const RWA_TOKEN_ABI = [
  ...ERC20_ABI,
  {
    type: "function",
    name: "assetType",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "assetDescription",
    inputs: [],
    outputs: [{ type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenInfo",
    inputs: [],
    outputs: [
      { name: "name_", type: "string" },
      { name: "symbol_", type: "string" },
      { name: "decimals_", type: "uint8" },
      { name: "totalSupply_", type: "uint256" },
      { name: "assetType_", type: "string" },
      { name: "kycRequired_", type: "bool" },
      { name: "accreditedOnly_", type: "bool" },
    ],
    stateMutability: "view",
  },
] as const;
