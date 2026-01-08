"use client";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AssetFormData } from "@/types/asset";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface StepComplianceProps {
  formData: AssetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
}

const jurisdictions = [
  { id: "NG", name: "Nigeria" },
  { id: "US", name: "United States" },
  { id: "ZA", name: "South Africa" },
  { id: "KE", name: "Kenya" },
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
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Regulatory Compliance</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Define access controls and jurisdiction limits for your regulated asset.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Col: Jurisdictions */}
        <div className="lg:col-span-2 space-y-6">
           <Card variant="glass" className="border-white/5 bg-white/[0.02]">
            <CardHeader className="pb-6 border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 text-sm">04</span>
                Allowed Jurisdictions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="flex flex-wrap gap-2.5">
                {jurisdictions.map((jurisdiction) => (
                  <button
                    key={jurisdiction.id}
                    onClick={() => toggleJurisdiction(jurisdiction.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border",
                      formData.compliance.jurisdictions.includes(jurisdiction.id)
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_10px_-3px_rgba(59,130,246,0.3)]"
                        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white hover:border-white/10"
                    )}
                  >
                    {jurisdiction.name}
                  </button>
                ))}
              </div>
              {formData.compliance.jurisdictions.length === 0 && (
                 <div className="flex items-center gap-2 mt-4 text-sm text-amber-500/80 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4" />
                  <span>No jurisdictions selected. This may be flagged as a compliance risk.</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="glass" className="border-white/5 bg-white/[0.02]">
             <CardHeader className="pb-6 border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 text-sm">05</span>
                Backing Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <Textarea
                label="Asset Manifesto / Legal Basis"
                placeholder="Describe the legal entity or physical asset backing this token..."
                value={formData.compliance.assetBackedBy}
                onChange={(e) => updateCompliance("assetBackedBy", e.target.value)}
                className="min-h-[140px] bg-black/20 border-white/10 focus:border-purple-500/50"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Controls */}
        <div className="space-y-6">
          <Card variant="glass" className="border-white/5 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
             <CardHeader className="pb-4">
              <CardTitle className="text-lg">Access Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ComplianceToggle
                enabled={formData.compliance.kycRequired}
                onToggle={() => toggleBoolean("kycRequired")}
                title="KYC Required"
                description="Identity verification"
                icon="🪪"
                activeColor="text-blue-400"
              />
              <ComplianceToggle
                enabled={formData.compliance.accreditedOnly}
                onToggle={() => toggleBoolean("accreditedOnly")}
                title="Accredited"
                description="Qualified investors only"
                icon="🏛️"
                 activeColor="text-purple-400"
              />
              <ComplianceToggle
                enabled={formData.compliance.transferRestrictions}
                onToggle={() => toggleBoolean("transferRestrictions")}
                title="Restricted Transfer"
                description="Approval required"
                icon="🔒"
                 activeColor="text-orange-400"
              />
            </CardContent>
          </Card>

          {/* Compliance Score Card */}
          <div className={cn(
            "rounded-2xl p-6 border transition-all duration-500",
            level === "Maximum" ? "bg-emerald-500/10 border-emerald-500/30" :
            level === "Standard" ? "bg-blue-500/10 border-blue-500/30" :
            level === "Basic" ? "bg-amber-500/10 border-amber-500/30" :
            "bg-red-500/10 border-red-500/30"
          )}>
            <div className="flex items-center gap-4 mb-3">
               <div className={cn("p-2.5 rounded-xl bg-black/20", color)}>
                <LevelIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider opacity-70 font-semibold">Security Level</div>
                <div className={cn("text-xl font-bold", color)}>{level}</div>
              </div>
            </div>
            <div className="text-sm opacity-60 leading-relaxed">
              {level === "Maximum" ? "Institutional grade security with full regulatory controls enabled." :
               level === "Standard" ? "Standard DeFi protections with optional identity checks." :
               level === "Basic" ? "Minimal restrictions. Open usage." :
               "No compliance layers active. Permissionless."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ComplianceToggleProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  icon: string;
  activeColor: string;
}

function ComplianceToggle({ enabled, onToggle, title, description, icon, activeColor }: ComplianceToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-4 w-full p-4 rounded-xl border transition-all duration-300 text-left group",
        enabled
          ? "border-white/10 bg-white/5"
          : "border-transparent hover:bg-white/[0.03]"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors",
        enabled ? "bg-white/10" : "bg-black/20 grayscale group-hover:grayscale-0"
      )}>
        {icon}
      </div>
      
      <div className="flex-1">
        <h4 className={cn("font-semibold text-sm mb-0.5", enabled ? activeColor : "text-white")}>
          {title}
        </h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

       <div
          className={cn(
            "w-10 h-5 rounded-full p-0.5 transition-colors duration-300 flex-shrink-0",
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
    </button>
  );
}
