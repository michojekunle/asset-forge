import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a wallet address to show first and last characters
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a number with commas and optional decimals
 */
export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a token amount with symbol
 */
export function formatTokenAmount(amount: bigint, decimals: number, symbol?: string): string {
  const value = Number(amount) / Math.pow(10, decimals);
  const formatted = formatNumber(value);
  return symbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a share URL for Twitter
 */
export function getTwitterShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({
    text,
    url,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Get Mantle block explorer URL
 */
export function getMantleExplorerUrl(type: "tx" | "address" | "token", hash: string, testnet = true): string {
  const baseUrl = testnet 
    ? "https://sepolia.mantlescan.xyz"
    : "https://mantlescan.xyz";
  return `${baseUrl}/${type}/${hash}`;
}

/**
 * Asset type labels and icons
 */
export const ASSET_TYPES = {
  REAL_ESTATE: {
    id: "real_estate",
    name: "Real Estate",
    description: "Tokenize property ownership and earn rental yields",
    icon: "🏠",
    color: "#6366f1",
  },
  BOND: {
    id: "bond",
    name: "Bond",
    description: "Create fixed-income instruments with scheduled payments",
    icon: "📈",
    color: "#8b5cf6",
  },
  INVOICE: {
    id: "invoice",
    name: "Invoice",
    description: "Finance receivables and trade invoices",
    icon: "📄",
    color: "#22d3ee",
  },
  CUSTOM: {
    id: "custom",
    name: "Custom",
    description: "Full control over token parameters",
    icon: "⚙️",
    color: "#10b981",
  },
} as const;

export type AssetTypeId = keyof typeof ASSET_TYPES;
