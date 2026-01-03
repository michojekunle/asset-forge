"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AssetFormData, initialFormData } from "@/types/asset";

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { id: "type", title: "Asset Type", description: "Choose your asset category" },
  { id: "details", title: "Asset Details", description: "Define asset information" },
  { id: "tokenomics", title: "Tokenomics", description: "Configure token settings" },
  { id: "compliance", title: "Compliance", description: "Set compliance requirements" },
  { id: "review", title: "Review & Deploy", description: "Confirm and launch" },
];

interface WizardContainerProps {
  children: (props: {
    formData: AssetFormData;
    setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
    currentStep: number;
    goToNextStep: () => void;
    goToPrevStep: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
  }) => React.ReactNode;
}

export function WizardContainer({ children }: WizardContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AssetFormData>(initialFormData);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
      {/* Progress Header */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create New Asset</h1>
            <p className="text-lg text-muted-foreground">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-sm text-muted-foreground block mb-1">Progress</span>
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
          </div>
        </div>
        <Progress value={progress} />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-12 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center min-w-max",
              index < steps.length - 1 && "flex-1"
            )}
          >
            <button
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                index === currentStep && "bg-primary/10",
                index < currentStep && "cursor-pointer hover:bg-muted",
                index > currentStep && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold transition-colors",
                  index < currentStep && "bg-success text-white",
                  index === currentStep && "bg-primary text-white",
                  index > currentStep && "bg-muted text-muted-foreground border border-border"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className={cn(
                  "text-base font-medium",
                  index === currentStep ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
              </div>
            </button>
            {index < steps.length - 1 && (
              <div className={cn(
                "hidden md:block flex-1 h-0.5 mx-3",
                index < currentStep ? "bg-success" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          {children({
            formData,
            setFormData,
            currentStep,
            goToNextStep,
            goToPrevStep,
            isFirstStep,
            isLastStep,
          })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
        <Button
          variant="secondary"
          size="lg"
          onClick={goToPrevStep}
          disabled={isFirstStep}
          className="px-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>
        
        {!isLastStep && (
          <Button
            variant="primary"
            size="lg"
            onClick={goToNextStep}
            className="px-8"
          >
            Next Step
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
