import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

// Mantle Sepolia Testnet Chain Definition
export const mantleSepolia = {
  id: 5003,
  name: "Mantle Sepolia",
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
      name: "Mantle Explorer",
      url: "https://sepolia.mantlescan.xyz",
    },
  },
  testnet: true,
} as const;

// WalletConnect Project ID
export const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

// Wagmi Configuration
export const wagmiConfig = createConfig({
  chains: [mantleSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: walletConnectProjectId,
      metadata: {
        name: "Asset Forge",
        description: "RWA Creator Studio on Mantle",
        url: "https://asset-forge.vercel.app",
        icons: ["https://asset-forge.vercel.app/logo.png"],
      },
      showQrModal: true, 
    }),
  ],
  transports: {
    [mantleSepolia.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  [mantleSepolia.id]: {
    assetFactory: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0x159C8d08C2aF10eB79a355Fd74b8170caABFDa30",
  },
} as const;

export const DEFAULT_CHAIN = mantleSepolia;
export const SUPPORTED_CHAIN_IDS = [mantleSepolia.id] as const;

export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAIN_IDS.includes(chainId as typeof SUPPORTED_CHAIN_IDS[number]);
}
