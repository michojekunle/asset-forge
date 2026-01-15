"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetFormData } from "@/types/asset";

interface StepDetailsProps {
  formData: AssetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
}

export function StepDetails({ formData, setFormData }: StepDetailsProps) {
  const updateDetails = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value,
      },
    }));
  };

  const renderAssetSpecificFields = () => {
    switch (formData.assetType) {
      case "real_estate":
        return (
          <Card variant="glass" className="mt-8 p-5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">🏠 Real Estate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-5">
              <Input
                label="Property Address"
                placeholder="123 Main Street, New York, NY 10001"
                value={formData.details.propertyAddress || ""}
                onChange={(e) =>
                  updateDetails("propertyAddress", e.target.value)
                }
                hint="Full physical address of the property"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Property Type"
                  placeholder="Residential, Commercial, Industrial..."
                  value={formData.details.propertyType || ""}
                  onChange={(e) =>
                    updateDetails("propertyType", e.target.value)
                  }
                />
                <Input
                  label="Appraisal Value (USD)"
                  placeholder="1,000,000"
                  type="number"
                  value={formData.details.appraisalValue || ""}
                  onChange={(e) =>
                    updateDetails("appraisalValue", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        );

      case "bond":
        return (
          <Card variant="glass" className="mt-8 p-5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">📈 Bond Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-5">
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Face Value (USD)"
                  placeholder="1,000"
                  type="number"
                  value={formData.details.faceValue || ""}
                  onChange={(e) => updateDetails("faceValue", e.target.value)}
                  hint="Par value of each bond token"
                />
                <Input
                  label="Interest Rate (%)"
                  placeholder="5.0"
                  type="number"
                  step="0.1"
                  value={formData.details.interestRate || ""}
                  onChange={(e) =>
                    updateDetails("interestRate", e.target.value)
                  }
                  hint="Annual coupon rate"
                />
              </div>
              <Input
                label="Maturity Date"
                type="date"
                value={formData.details.maturityDate || ""}
                onChange={(e) => updateDetails("maturityDate", e.target.value)}
                hint="When the bond matures and principal is returned"
              />
            </CardContent>
          </Card>
        );

      case "invoice":
        return (
          <Card variant="glass" className="mt-8 p-5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">📄 Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 ">
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Invoice Number"
                  placeholder="INV-2026-001"
                  value={formData.details.invoiceNumber || ""}
                  onChange={(e) =>
                    updateDetails("invoiceNumber", e.target.value)
                  }
                />
                <Input
                  label="Invoice Amount (USD)"
                  placeholder="50,000"
                  type="number"
                  value={formData.details.invoiceAmount || ""}
                  onChange={(e) =>
                    updateDetails("invoiceAmount", e.target.value)
                  }
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Due Date"
                  type="date"
                  value={formData.details.dueDate || ""}
                  onChange={(e) => updateDetails("dueDate", e.target.value)}
                />
                <Input
                  label="Debtor Name"
                  placeholder="Acme Corporation"
                  value={formData.details.debtor || ""}
                  onChange={(e) => updateDetails("debtor", e.target.value)}
                  hint="Company or entity that owes the invoice"
                />
              </div>
            </CardContent>
          </Card>
        );

      case "custom":
        return (
          <Card variant="glass" className="mt-8 p-5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                🛠️ Standard Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Flexible Asset Structure
                </h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  Custom tokens use the standard ERC-20 structure with enhanced
                  metadata capabilities. All specific details for your asset
                  should be included in the <strong>Description</strong> field
                  above. You can define custom compliance rules in the next
                  step.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 tracking-tight">
          Asset Specification
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Define the core parameters and metadata for your on-chain asset.
        </p>
      </div>

      {/* Common Fields */}
      <Card variant="glass" className="border-white/5 bg-white/[0.02] p-5">
        <CardHeader className="pb-6 border-b border-white/5">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm">
              01
            </span>
            Token Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div className="grid sm:grid-cols-2 gap-8">
            <Input
              label="Token Name"
              placeholder="e.g. Manhattan Luxury Apartment"
              value={formData.details.name}
              onChange={(e) => updateDetails("name", e.target.value)}
              hint="The display name for your asset token"
              className="bg-black/20 border-white/10 focus:border-emerald-500/50"
            />
            <Input
              label="Token Symbol"
              placeholder="MLA"
              value={formData.details.symbol}
              onChange={(e) =>
                updateDetails("symbol", e.target.value.toUpperCase())
              }
              hint="3-5 character identifier (e.g. PROP)"
              className="bg-black/20 border-white/10 focus:border-emerald-500/50"
            />
          </div>
          <Textarea
            label="Description"
            placeholder="Provide a comprehensive description of the asset, its location, value proposition, and any other relevant details for investors..."
            value={formData.details.description}
            onChange={(e) => updateDetails("description", e.target.value)}
            hint="This will be permanently stored in the asset metadata"
            className="min-h-[120px] bg-black/20 border-white/10 focus:border-emerald-500/50 resize-none"
          />
        </CardContent>
      </Card>

      {/* Asset-specific fields */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        {renderAssetSpecificFields()}
      </div>
    </div>
  );
}
