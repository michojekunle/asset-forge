"use client";

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
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Select Asset Type</h2>
        <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
          Choose the type of real-world asset you want to tokenize. Each template comes with
          pre-configured smart contract features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {assetTypes.map((type) => (
          <Card
            key={type.id}
            variant="glass"
            hover
            className={cn(
              "cursor-pointer transition-all duration-300 p-0",
              formData.assetType === type.id && "ring-2 ring-primary border-primary/50"
            )}
            onClick={() => handleSelect(type.id)}
          >
            <CardContent className="p-10">
              <div className="flex items-start gap-6 mb-8">
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                  type.gradient
                )}>
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{type.name}</h3>
                    {formData.assetType === type.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-base text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary/50 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
