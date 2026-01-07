"use client";

import { WizardContainer } from "@/components/wizard/wizard-container";
import { StepAssetType } from "@/components/wizard/step-asset-type";
import { StepDetails } from "@/components/wizard/step-details";
import { StepTokenomics } from "@/components/wizard/step-tokenomics";
import { StepCompliance } from "@/components/wizard/step-compliance";
import { StepReview } from "@/components/wizard/step-review";

export default function CreateAssetPage() {
  return (
    <div className="min-h-screen">
      <WizardContainer>
        {({ formData, setFormData, currentStep }) => {
          switch (currentStep) {
            case 0:
              return (
                <StepAssetType formData={formData} setFormData={setFormData} />
              );
            case 1:
              return (
                <StepDetails formData={formData} setFormData={setFormData} />
              );
            case 2:
              return (
                <StepTokenomics formData={formData} setFormData={setFormData} />
              );
            case 3:
              return (
                <StepCompliance formData={formData} setFormData={setFormData} />
              );
            case 4:
              return (
                <StepReview formData={formData} setFormData={setFormData} />
              );
            default:
              return null;
          }
        }}
      </WizardContainer>
    </div>
  );
}
