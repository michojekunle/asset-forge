"use client";

import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AssetFormData } from "@/types/asset";

interface StepTokenomicsProps {
  formData: AssetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
}

export function StepTokenomics({ formData, setFormData }: StepTokenomicsProps) {
  const { address } = useAccount();

  const updateTokenomics = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      tokenomics: {
        ...prev.tokenomics,
        [field]: value,
      },
    }));
  };

  const toggleFeature = (field: "mintable" | "burnable" | "pausable") => {
    updateTokenomics(field, !formData.tokenomics[field]);
  };

  // Use connected wallet as default if not set
  const initialMintAddress = formData.tokenomics.initialMintAddress || address || "";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Token Economics</h2>
        <p className="text-muted-foreground">
          Configure the economic parameters of your token. These settings affect how
          the token functions on the blockchain.
        </p>
      </div>

      {/* Supply & Distribution */}
      <Card variant="glass" className="p-5">
        <CardHeader>
          <CardTitle className="text-lg">Supply & Distribution</CardTitle>
          <CardDescription>
            Define the total supply and initial distribution of your tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Total Supply"
              placeholder="1,000,000"
              type="number"
              value={formData.tokenomics.totalSupply}
              onChange={(e) => updateTokenomics("totalSupply", e.target.value)}
              hint="Maximum number of tokens that will exist"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Decimals</label>
              <div className="flex gap-2">
                {[0, 6, 8, 18].map((dec) => (
                  <button
                    key={dec}
                    onClick={() => updateTokenomics("decimals", dec)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                      formData.tokenomics.decimals === dec
                        ? "bg-white text-muted"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    {dec}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                18 is standard for most tokens
              </p>
            </div>
          </div>
          <Input
            label="Initial Mint Address"
            placeholder="0x..."
            value={initialMintAddress}
            onChange={(e) => updateTokenomics("initialMintAddress", e.target.value)}
            hint="Address that will receive the initial token supply"
          />
          {address && !formData.tokenomics.initialMintAddress && (
            <button
              onClick={() => updateTokenomics("initialMintAddress", address)}
              className="text-sm text-primary hover:underline"
            >
              Use connected wallet ({address.slice(0, 6)}...{address.slice(-4)})
            </button>
          )}
        </CardContent>
      </Card>

      {/* Token Features */}
      <Card variant="glass" className="p-5">
        <CardHeader>
          <CardTitle className="text-lg">Token Features</CardTitle>
          <CardDescription>
            Enable or disable token functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <FeatureToggle
              enabled={formData.tokenomics.mintable}
              onToggle={() => toggleFeature("mintable")}
              title="Mintable"
              description="Allow creating new tokens after deployment"
            />
            <FeatureToggle
              enabled={formData.tokenomics.burnable}
              onToggle={() => toggleFeature("burnable")}
              title="Burnable"
              description="Allow destroying tokens to reduce supply"
            />
            <FeatureToggle
              enabled={formData.tokenomics.pausable}
              onToggle={() => toggleFeature("pausable")}
              title="Pausable"
              description="Allow pausing all token transfers"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card variant="default">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              {formData.tokenomics.totalSupply || "0"} {formData.details.symbol || "TOKENS"}
            </Badge>
            <Badge variant="secondary">
              {formData.tokenomics.decimals} decimals
            </Badge>
            {formData.tokenomics.mintable && <Badge variant="success">Mintable</Badge>}
            {formData.tokenomics.burnable && <Badge variant="warning">Burnable</Badge>}
            {formData.tokenomics.pausable && <Badge variant="error">Pausable</Badge>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureToggleProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  description: string;
}

function FeatureToggle({ enabled, onToggle, title, description }: FeatureToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "p-4 rounded-xl border text-left transition-all",
        enabled
          ? "border-primary bg-primary/10"
          : "border-border bg-muted hover:bg-muted/80"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{title}</span>
        <div
          className={cn(
            "w-10 h-6 rounded-full p-1 transition-colors",
            enabled ? "bg-primary" : "bg-border"
          )}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full bg-white transition-transform",
              enabled ? "translate-x-4 bg-secondary" : "translate-x-0 bg-muted"
            )}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}
