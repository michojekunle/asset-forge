"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetFormData } from "@/types/asset";
import { ASSET_TYPES, getMantleExplorerUrl, formatAddress } from "@/lib/utils";
import { mantleSepolia } from "@/config/wagmi";
import {
  Rocket,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Loader2,
} from "lucide-react";

interface StepReviewProps {
  formData: AssetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
}

export function StepReview({ formData }: StepReviewProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isTestnet = chainId === mantleSepolia.id;
  const assetTypeInfo = ASSET_TYPES[formData.assetType.toUpperCase() as keyof typeof ASSET_TYPES];

  const handleDeploy = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      // Simulate deployment for demo purposes
      // In production, this would call the actual contract deployment
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Mock deployed address and tx hash
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 42).padEnd(40, "0");
      const mockTxHash = "0x" + Math.random().toString(16).slice(2, 66).padEnd(64, "0");
      
      setDeployedAddress(mockAddress);
      setTxHash(mockTxHash);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed");
    } finally {
      setIsDeploying(false);
    }
  };

  if (deployedAddress) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Asset Deployed Successfully! 🎉</h2>
          <p className="text-muted-foreground">
            Your {formData.details.name} token is now live on {isTestnet ? "Mantle Sepolia" : "Mantle"}.
          </p>
        </div>

        <Card variant="glow">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-sm text-muted-foreground">Contract Address</span>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono">{formatAddress(deployedAddress, 8)}</code>
                <button className="text-muted-foreground hover:text-foreground">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-sm text-muted-foreground">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono">{formatAddress(txHash || "", 8)}</code>
                <a
                  href={getMantleExplorerUrl("tx", txHash || "", isTestnet)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button variant="primary" className="w-full">
              View in Dashboard
            </Button>
          </Link>
          <a
            href={getMantleExplorerUrl("address", deployedAddress, isTestnet)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" className="w-full">
              View on Explorer
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review & Deploy</h2>
        <p className="text-muted-foreground">
          Review your asset configuration before deploying to the blockchain.
          This action is irreversible.
        </p>
      </div>

      {/* Asset Summary */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{assetTypeInfo?.icon}</div>
            <div>
              <CardTitle>{formData.details.name || "Unnamed Asset"}</CardTitle>
              <Badge variant="secondary">{formData.details.symbol || "---"}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.details.description && (
            <p className="text-sm text-muted-foreground">{formData.details.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-base">Token Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SummaryRow label="Total Supply" value={formData.tokenomics.totalSupply} />
            <SummaryRow label="Decimals" value={formData.tokenomics.decimals.toString()} />
            <SummaryRow label="Mintable" value={formData.tokenomics.mintable ? "Yes" : "No"} />
            <SummaryRow label="Burnable" value={formData.tokenomics.burnable ? "Yes" : "No"} />
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-base">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SummaryRow label="KYC Required" value={formData.compliance.kycRequired ? "Yes" : "No"} />
            <SummaryRow label="Accredited Only" value={formData.compliance.accreditedOnly ? "Yes" : "No"} />
            <SummaryRow 
              label="Jurisdictions" 
              value={formData.compliance.jurisdictions.length > 0 
                ? formData.compliance.jurisdictions.join(", ") 
                : "None"} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Deployment Section */}
      <Card variant="glow">
        <CardContent className="pt-6">
          {!isConnected ? (
            <div className="text-center py-4">
              <AlertCircle className="h-12 w-12 text-warning mx-auto mb-3" />
              <p className="text-lg font-medium mb-2">Wallet Not Connected</p>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your wallet to deploy this asset
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Deploying to</p>
                  <p className="font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isTestnet ? "bg-warning" : "bg-success"}`} />
                    {isTestnet ? "Mantle Sepolia Testnet" : "Mantle Mainnet"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-mono text-sm">{formatAddress(address || "")}</p>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm mb-4">
                  {error}
                </div>
              )}

              <Button
                variant="primary"
                size="xl"
                className="w-full"
                onClick={handleDeploy}
                disabled={isDeploying}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5" />
                    Deploy to {isTestnet ? "Testnet" : "Mainnet"}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                By deploying, you agree to the terms of service and confirm that all
                information provided is accurate.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
