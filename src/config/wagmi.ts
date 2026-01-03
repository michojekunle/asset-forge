import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Mantle Sepolia Testnet Chain Definition
export const mantleSepolia = {
  id: 5003,
  name: "Mantle Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.sepolia.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Sepolia Explorer",
      url: "https://sepolia.mantlescan.xyz",
    },
  },
  testnet: true,
} as const;

// Mantle Mainnet Chain Definition
export const mantleMainnet = {
  id: 5000,
  name: "Mantle",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Explorer",
      url: "https://mantlescan.xyz",
    },
  },
  testnet: false,
} as const;

// WalletConnect Project ID - Get one at https://cloud.walletconnect.com
export const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

// Wagmi Configuration
export const wagmiConfig = createConfig({
  chains: [mantleSepolia, mantleMainnet, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: walletConnectProjectId,
      metadata: {
        name: "RWA Asset Creator Studio",
        description: "Create and deploy real-world asset tokens on Mantle",
        url: "https://rwa-asset-creator.vercel.app",
        icons: ["https://rwa-asset-creator.vercel.app/logo.png"],
      },
    }),
  ],
  transports: {
    [mantleSepolia.id]: http(),
    [mantleMainnet.id]: http(),
    [mainnet.id]: http(),
  },
});

// Contract Addresses (deployed on Mantle Sepolia)
export const CONTRACT_ADDRESSES = {
  [mantleSepolia.id]: {
    assetFactory: "0x0000000000000000000000000000000000000000", // To be deployed
  },
  [mantleMainnet.id]: {
    assetFactory: "0x0000000000000000000000000000000000000000", // To be deployed
  },
} as const;

// Default chain
export const DEFAULT_CHAIN = mantleSepolia;

// Supported chain IDs
export const SUPPORTED_CHAIN_IDS = [mantleSepolia.id, mantleMainnet.id] as const;

// Check if chain is supported
export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAIN_IDS.includes(chainId as typeof SUPPORTED_CHAIN_IDS[number]);
}
