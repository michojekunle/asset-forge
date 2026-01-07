"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import {
  Menu,
  X,
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatAddress, copyToClipboard, getMantleExplorerUrl } from "@/lib/utils";
import { mantleSepolia, walletConnectProjectId } from "@/config/wagmi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Create Asset", href: "/create" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Showcase", href: "/showcase" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const { switchChain } = useSwitchChain();
  const isTestnet = chainId === mantleSepolia.id;
  const isWrongNetwork = chainId !== mantleSepolia.id;

  const handleCopyAddress = async () => {
    if (address) {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: mantleSepolia.id });
  };

  const handleConnectInjected = () => {
    connect({ connector: injected() });
    setWalletMenuOpen(false);
  };

  const handleConnectWalletConnect = () => {
    connect({ 
      connector: walletConnect({ 
        projectId: walletConnectProjectId 
      }) 
    });
    setWalletMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0c]/90 backdrop-blur-lg border-b border-neutral-800/50 px-16">
      <nav className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-xs font-bold text-black">AF</span>
            </div>
            <span className="text-sm font-semibold text-white hidden sm:block tracking-tight">Asset Forge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Wallet Section */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isWrongNetwork ? "bg-red-500" : isTestnet ? "bg-yellow-500" : "bg-green-500"
                  )} />
                  <span className="text-sm font-medium text-neutral-300 hidden sm:block">
                    {isWrongNetwork ? "Wrong Network" : formatAddress(address || "")}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                </button>

                <AnimatePresence>
                  {walletMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl"
                    >
                      {/* Address & Balance */}
                      <div className="px-4 py-3 border-b border-neutral-800">
                        <p className="text-xs text-neutral-500 mb-1.5 uppercase tracking-wide">Wallet</p>
                        <p className="font-mono text-sm font-medium text-white mb-2">
                          {formatAddress(address || "", 8)}
                        </p>
                        {balance && (
                          <p className="text-xs text-neutral-500">
                            {(Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(4)} {balance.symbol}
                          </p>
                        )}
                      </div>

                      {/* Network Info */}
                      <div className="px-4 py-3 border-b border-neutral-800">
                        <p className="text-xs text-neutral-500 mb-1.5 uppercase tracking-wide">Network</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isTestnet ? "bg-yellow-500" : "bg-red-500"
                            )} />
                            <span className="text-sm font-medium text-white">
                              {isTestnet ? "Mantle Sepolia" : "Wrong Network"}
                            </span>
                          </div>
                          {!isTestnet && (
                            <button
                              onClick={handleSwitchNetwork}
                              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Switch to Testnet
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-2 py-2">
                        <button
                          onClick={handleCopyAddress}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-neutral-500" />
                          )}
                          <span className="text-sm text-neutral-300">{copied ? "Copied!" : "Copy Address"}</span>
                        </button>
                        <a
                          href={getMantleExplorerUrl("address", address || "", isTestnet)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-neutral-500" />
                          <span className="text-sm text-neutral-300">View on Explorer</span>
                        </a>
                        <button
                          onClick={() => {
                            disconnect();
                            setWalletMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors text-red-400"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Disconnect</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="relative">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  disabled={isPending}
                  isLoading={isPending}
                >
                  <Wallet className="h-4 w-4" />
                  Connect
                </Button>

                <AnimatePresence>
                  {walletMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl"
                    >
                      <p className="px-4 pb-3 text-xs text-neutral-500 uppercase tracking-wide">Connect Wallet</p>
                      <div className="px-2 space-y-1">
                        <button
                          onClick={handleConnectInjected}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center">
                            <span className="text-lg">🦊</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-white">MetaMask</p>
                            <p className="text-xs text-neutral-500">Browser Extension</p>
                          </div>
                        </button>
                        <button
                          onClick={handleConnectWalletConnect}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-800 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center">
                            <span className="text-lg">🔗</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-white">WalletConnect</p>
                            <p className="text-xs text-neutral-500">Mobile & Desktop</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-neutral-400" />
              ) : (
                <Menu className="h-5 w-5 text-neutral-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-neutral-800 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
