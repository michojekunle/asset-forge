"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from "wagmi";
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
import { mantleSepolia, mantleMainnet, walletConnectProjectId } from "@/config/wagmi";

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

  const isTestnet = chainId === mantleSepolia.id;
  const isWrongNetwork = chainId !== mantleSepolia.id && chainId !== mantleMainnet.id;

  const handleCopyAddress = async () => {
    if (address) {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <nav className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-xl font-bold text-white">AF</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">Asset Forge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Wallet Section */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl glass border border-border hover:border-primary/50 transition-colors"
                >
                  {/* Network Status */}
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    isWrongNetwork ? "bg-error" : isTestnet ? "bg-warning" : "bg-success"
                  )} />
                  <span className="text-base font-medium hidden sm:block">
                    {formatAddress(address || "")}
                  </span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {walletMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 py-3 rounded-2xl glass border border-border shadow-xl"
                    >
                      {/* Address & Balance */}
                      <div className="px-5 py-4 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-2">Connected Wallet</p>
                        <p className="font-mono text-base font-medium mb-3">
                          {formatAddress(address || "", 8)}
                        </p>
                        {balance && (
                          <p className="text-sm text-muted-foreground">
                            Balance: {(Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(4)} {balance.symbol}
                          </p>
                        )}
                      </div>

                      {/* Network Info */}
                      <div className="px-5 py-4 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-2">Network</p>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            isTestnet ? "bg-warning" : "bg-success"
                          )} />
                          <span className="text-base font-medium">
                            {isTestnet ? "Mantle Sepolia" : "Mantle Mainnet"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-2 py-3">
                        <button
                          onClick={handleCopyAddress}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          {copied ? (
                            <Check className="h-5 w-5 text-success" />
                          ) : (
                            <Copy className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="text-base">{copied ? "Copied!" : "Copy Address"}</span>
                        </button>
                        <a
                          href={getMantleExplorerUrl("address", address || "", isTestnet)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="h-5 w-5 text-muted-foreground" />
                          <span className="text-base">View on Explorer</span>
                        </a>
                        <button
                          onClick={() => {
                            disconnect();
                            setWalletMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-error"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="text-base">Disconnect</span>
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
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  disabled={isPending}
                  isLoading={isPending}
                  className="px-6 py-3 h-auto text-base"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Button>

                <AnimatePresence>
                  {walletMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-72 py-4 rounded-2xl glass border border-border shadow-xl"
                    >
                      <p className="px-5 pb-4 text-sm text-muted-foreground">Choose a wallet to connect</p>
                      <div className="px-3 space-y-2">
                        <button
                          onClick={handleConnectInjected}
                          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <span className="text-2xl">🦊</span>
                          </div>
                          <div>
                            <p className="font-semibold text-base">MetaMask</p>
                            <p className="text-sm text-muted-foreground">Browser Extension</p>
                          </div>
                        </button>
                        <button
                          onClick={handleConnectWalletConnect}
                          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <span className="text-2xl">🔗</span>
                          </div>
                          <div>
                            <p className="font-semibold text-base">WalletConnect</p>
                            <p className="text-sm text-muted-foreground">Mobile & Desktop</p>
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
              className="lg:hidden p-3 rounded-xl hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-4 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
