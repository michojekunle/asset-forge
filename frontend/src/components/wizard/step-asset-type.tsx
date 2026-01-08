"use client";

import { motion } from "framer-motion";
import { Building2, Coins, FileText, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AssetFormData, AssetType } from "@/types/asset";

interface StepAssetTypeProps {
  formData: AssetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
}

const assetTypes: {
  id: AssetType;
  name: string;
  description: string;
  icon: typeof Building2;
  gradient: string;
  features: string[];
}[] = [
  {
    id: "real_estate",
    name: "Real Estate",
    description: "Tokenize property ownership with rental yield distribution",
    icon: Building2,
    gradient: "from-indigo-500 to-purple-500",
    features: [
      "Property ownership tokens",
      "Dividend distribution",
      "Voting rights for holders",
      "Appraisal value tracking",
    ],
  },
  {
    id: "bond",
    name: "Bond",
    description: "Create fixed-income instruments with scheduled payments",
    icon: Coins,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "Fixed maturity date",
      "Interest rate configuration",
      "Automated coupon payments",
      "Principal repayment schedule",
    ],
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Finance receivables and trade invoice tokens",
    icon: FileText,
    gradient: "from-cyan-500 to-blue-500",
    features: [
      "Invoice tokenization",
      "Early redemption options",
      "Financing discount logic",
      "Auto-payment triggers",
    ],
  },
  {
    id: "custom",
    name: "Custom Token",
    description: "Full control over all token parameters",
    icon: Layers,
    gradient: "from-green-500 to-emerald-500",
    features: [
      "Custom metadata fields",
      "Flexible token economics",
      "Any asset type",
      "Full customization",
    ],
  },
];

export function StepAssetType({ formData, setFormData }: StepAssetTypeProps) {
  const handleSelect = (assetType: AssetType) => {
    setFormData((prev) => ({
      ...prev,
      assetType,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Select Asset Type</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose the template that best fits your real-world asset.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {assetTypes.map((type) => (
          <Card
            key={type.id}
            variant="glass"
            hover
            className={cn(
              "cursor-pointer group relative overflow-hidden transition-all duration-300 border-white/5",
              formData.assetType === type.id 
                ? "ring-2 ring-emerald-500/50 bg-white/[0.03]" 
                : "hover:bg-white/[0.04] opacity-80 hover:opacity-100"
            )}
            onClick={() => handleSelect(type.id)}
          >
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
              type.gradient
            )} />
            
            <CardContent className="p-8 relative z-10">
              <div className="flex items-start gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                  "bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
                )}>
                  <type.icon className="h-7 w-7 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {type.name}
                    </h3>
                    {formData.assetType === type.id && (
                      <motion.div
                        layoutId="active-indicator"
                        className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {type.description}
                  </p>

                  <div className="space-y-2">
                    {type.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground/80">
                        <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
