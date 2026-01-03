"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AssetFormData } from "@/types/asset";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface StepComplianceProps {
  formData: AssetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
}

const jurisdictions = [
  { id: "US", name: "United States" },
  { id: "EU", name: "European Union" },
  { id: "UK", name: "United Kingdom" },
  { id: "SG", name: "Singapore" },
  { id: "HK", name: "Hong Kong" },
  { id: "GLOBAL", name: "Global (No Restrictions)" },
];

export function StepCompliance({ formData, setFormData }: StepComplianceProps) {
  const updateCompliance = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      compliance: {
        ...prev.compliance,
        [field]: value,
      },
    }));
  };

  const toggleJurisdiction = (jurisdictionId: string) => {
    const current = formData.compliance.jurisdictions;
    const updated = current.includes(jurisdictionId)
      ? current.filter((j) => j !== jurisdictionId)
      : [...current, jurisdictionId];
    updateCompliance("jurisdictions", updated);
  };

  const toggleBoolean = (field: "kycRequired" | "accreditedOnly" | "transferRestrictions") => {
    updateCompliance(field, !formData.compliance[field]);
  };

  const complianceLevel = () => {
    const { kycRequired, accreditedOnly, transferRestrictions } = formData.compliance;
    const count = [kycRequired, accreditedOnly, transferRestrictions].filter(Boolean).length;
    if (count === 0) return { level: "None", color: "text-muted-foreground", icon: AlertTriangle };
    if (count === 1) return { level: "Basic", color: "text-warning", icon: Shield };
    if (count === 2) return { level: "Standard", color: "text-primary", icon: Shield };
    return { level: "Maximum", color: "text-success", icon: CheckCircle2 };
  };

  const { level, color, icon: LevelIcon } = complianceLevel();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Compliance Settings</h2>
        <p className="text-muted-foreground">
          Configure compliance requirements for your token. These settings determine
          who can participate and under what conditions.
        </p>
      </div>

      {/* Compliance Level Indicator */}
      <Card variant="glow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-muted", color)}>
                <LevelIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliance Level</p>
                <p className={cn("text-lg font-semibold", color)}>{level}</p>
              </div>
            </div>
            <Badge variant={level === "None" ? "warning" : "success"}>
              {level === "None" ? "No restrictions" : "Regulated"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Requirements */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Requirements</CardTitle>
          <CardDescription>
            Enable compliance checks for token holders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <ComplianceToggle
              enabled={formData.compliance.kycRequired}
              onToggle={() => toggleBoolean("kycRequired")}
              title="KYC Required"
              description="Holders must complete identity verification"
              icon="🪪"
            />
            <ComplianceToggle
              enabled={formData.compliance.accreditedOnly}
              onToggle={() => toggleBoolean("accreditedOnly")}
              title="Accredited Only"
              description="Restrict to accredited investors"
              icon="🏛️"
            />
            <ComplianceToggle
              enabled={formData.compliance.transferRestrictions}
              onToggle={() => toggleBoolean("transferRestrictions")}
              title="Transfer Restrictions"
              description="Limit token transfers between parties"
              icon="🔒"
            />
          </div>
        </CardContent>
      </Card>

      {/* Jurisdictions */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Allowed Jurisdictions</CardTitle>
          <CardDescription>
            Select jurisdictions where the token can be traded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {jurisdictions.map((jurisdiction) => (
              <button
                key={jurisdiction.id}
                onClick={() => toggleJurisdiction(jurisdiction.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  formData.compliance.jurisdictions.includes(jurisdiction.id)
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {jurisdiction.name}
              </button>
            ))}
          </div>
          {formData.compliance.jurisdictions.length === 0 && (
            <p className="text-sm text-warning mt-3">
              ⚠️ No jurisdictions selected. Consider adding at least one.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Asset Backing & Documentation */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Asset Documentation</CardTitle>
          <CardDescription>
            Provide information about the underlying asset
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Asset Backed By"
            placeholder="Describe what backs this token (e.g., 'This token represents fractional ownership in a 10-unit apartment building located at...')"
            value={formData.compliance.assetBackedBy}
            onChange={(e) => updateCompliance("assetBackedBy", e.target.value)}
          />
          <Input
            label="Legal Document URL"
            placeholder="https://example.com/legal-docs.pdf"
            value={formData.compliance.legalDocumentUrl}
            onChange={(e) => updateCompliance("legalDocumentUrl", e.target.value)}
            hint="Link to offering documents, terms, or legal disclosures"
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface ComplianceToggleProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  icon: string;
}

function ComplianceToggle({ enabled, onToggle, title, description, icon }: ComplianceToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "p-4 rounded-xl border text-left transition-all",
        enabled
          ? "border-success bg-success/10"
          : "border-border bg-muted hover:bg-muted/80"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="mt-3">
        <Badge variant={enabled ? "success" : "secondary"}>
          {enabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>
    </button>
  );
}
