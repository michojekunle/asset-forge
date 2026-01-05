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
                onChange={(e) => updateDetails("propertyAddress", e.target.value)}
                hint="Full physical address of the property"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Property Type"
                  placeholder="Residential, Commercial, Industrial..."
                  value={formData.details.propertyType || ""}
                  onChange={(e) => updateDetails("propertyType", e.target.value)}
                />
                <Input
                  label="Appraisal Value (USD)"
                  placeholder="1,000,000"
                  type="number"
                  value={formData.details.appraisalValue || ""}
                  onChange={(e) => updateDetails("appraisalValue", e.target.value)}
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
                  onChange={(e) => updateDetails("interestRate", e.target.value)}
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
                  onChange={(e) => updateDetails("invoiceNumber", e.target.value)}
                />
                <Input
                  label="Invoice Amount (USD)"
                  placeholder="50,000"
                  type="number"
                  value={formData.details.invoiceAmount || ""}
                  onChange={(e) => updateDetails("invoiceAmount", e.target.value)}
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

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Asset Details</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Provide information about your asset. This metadata will be stored on-chain.
        </p>
      </div>

      {/* Common Fields */}
      <Card variant="glass" className="p-5">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Token Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Token Name"
              placeholder="My Real Estate Token"
              value={formData.details.name}
              onChange={(e) => updateDetails("name", e.target.value)}
              hint="Full name of your token"
            />
            <Input
              label="Token Symbol"
              placeholder="MRT"
              value={formData.details.symbol}
              onChange={(e) => updateDetails("symbol", e.target.value.toUpperCase())}
              hint="3-5 character ticker symbol"
            />
          </div>
          <Textarea
            label="Description"
            placeholder="Describe your asset, its value proposition, and any relevant details..."
            value={formData.details.description}
            onChange={(e) => updateDetails("description", e.target.value)}
            hint="This will be visible to potential investors"
          />
        </CardContent>
      </Card>

      {/* Asset-specific fields */}
      {renderAssetSpecificFields()}
    </div>
  );
}
