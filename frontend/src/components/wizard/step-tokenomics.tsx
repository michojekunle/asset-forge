"use client";

import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Token Configuration</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Set up the economic model and technical properties of your token.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Supply */}
        <Card variant="glass" className="border-white/5 bg-white/[0.02] h-full">
          <CardHeader className="pb-6 border-b border-white/5">
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-sm">02</span>
              Supply & Minting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <Input
              label="Total Theoretical Supply"
              placeholder="1,000,000"
              type="number"
              value={formData.tokenomics.totalSupply}
              onChange={(e) => updateTokenomics("totalSupply", e.target.value)}
              hint="Max tokens that can ever exist"
              className="bg-black/20 border-white/10"
            />
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Decimals</label>
              <div className="flex p-1 bg-black/20 rounded-xl border border-white/10">
                {[0, 6, 8, 18].map((dec) => (
                  <button
                    key={dec}
                    onClick={() => updateTokenomics("decimals", dec)}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300",
                      formData.tokenomics.decimals === dec
                        ? "bg-indigo-500/20 text-indigo-300 shadow-sm ring-1 ring-indigo-500/50"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    {dec}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
               <Input
                label="Initial Mint Destination"
                placeholder="0x..."
                value={initialMintAddress}
                onChange={(e) => updateTokenomics("initialMintAddress", e.target.value)}
                hint="Wallet address to receive initial supply"
                className="bg-black/20 border-white/10"
              />
              {address && !formData.tokenomics.initialMintAddress && (
                <button
                  onClick={() => updateTokenomics("initialMintAddress", address || "")}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <span>↳</span> Use connected wallet
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Features */}
        <Card variant="glass" className="border-white/5 bg-white/[0.02] h-full">
          <CardHeader className="pb-6 border-b border-white/5">
             <CardTitle className="text-xl flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 text-sm">03</span>
              Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-4">
             <FeatureToggle
              enabled={formData.tokenomics.mintable}
              onToggle={() => toggleFeature("mintable")}
              title="Mintable"
              description="Issuer can mint more tokens later"
              gradient="from-pink-500/20 to-rose-500/20"
              activeColor="text-pink-400"
            />
            <FeatureToggle
              enabled={formData.tokenomics.burnable}
              onToggle={() => toggleFeature("burnable")}
              title="Burnable"
              description="Holders can destroy tokens"
              gradient="from-orange-500/20 to-amber-500/20"
              activeColor="text-orange-400"
            />
            <FeatureToggle
              enabled={formData.tokenomics.pausable}
              onToggle={() => toggleFeature("pausable")}
              title="Pausable"
              description="Emergency freeze functionality"
              gradient="from-red-500/20 to-red-600/20"
              activeColor="text-red-400"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
           <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Summary</span>
           <div className="h-4 w-[1px] bg-white/10" />
           <span className="text-sm font-mono text-white">
             {Number(formData.tokenomics.totalSupply).toLocaleString()} <span className="text-indigo-400">{formData.details.symbol || "TOKENS"}</span>
           </span>
        </div>
      </div>
    </div>
  );
}

interface FeatureToggleProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  gradient: string;
  activeColor: string;
}

function FeatureToggle({ enabled, onToggle, title, description, gradient, activeColor }: FeatureToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-full p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden group",
        enabled
          ? "border-transparent bg-white/5"
          : "border-white/5 bg-transparent hover:bg-white/[0.02]"
      )}
    >
      {enabled && (
        <div className={cn("absolute inset-0 opacity-100 bg-gradient-to-r transition-opacity", gradient)} />
      )}
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
           <h4 className={cn("font-semibold mb-1 transition-colors", enabled ? activeColor : "text-white")}>
             {title}
           </h4>
           <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
             {description}
           </p>
        </div>

        <div
          className={cn(
            "w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ml-3 flex-shrink-0 mt-1",
            enabled ? "bg-white/20" : "bg-white/5"
          )}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full shadow-sm transition-transform duration-300",
              enabled ? "translate-x-5 bg-white scale-110" : "translate-x-0 bg-white/30"
            )}
          />
        </div>
      </div>
    </button>
  );
}
