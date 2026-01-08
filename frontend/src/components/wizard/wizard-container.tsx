"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-start pt-12 pb-20 px-4 sm:px-6">
      {/* Centered Container */}
      <div className="w-full max-w-5xl">
        
        {/* Minimal Header */}
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-white bg-white/10 rounded-full ml-1">
              {steps[currentStep].title}
            </span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-3 tracking-tight">
            Create New Asset
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Improved Step Indicators */}
        <div className="relative flex items-center justify-between mb-16 max-w-3xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-emerald-500 to-emerald-400 z-0 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

          {steps.map((step, index) => {
             const isCompleted = index < currentStep;
             const isCurrent = index === currentStep;

             return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group">
                <button
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted && "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]",
                    isCurrent && "bg-black border-emerald-500 text-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
                    !isCompleted && !isCurrent && "bg-black/50 border-white/10 text-muted-foreground hover:border-white/30 backdrop-blur-sm"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </button>
                
                {/* Tooltip-style Label */}
                <div className={cn(
                  "absolute top-14 left-1/2 -translate-x-1/2 w max-w-[120px] text-center transition-all duration-300",
                  isCurrent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                )}>
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest">
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
        </div>

        {/* Futuristic Navigation */}
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={goToPrevStep}
            disabled={isFirstStep}
            className={cn(
              "group text-muted-foreground hover:text-white hover:bg-white/5 transition-all",
              isFirstStep && "invisible"
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          {!isLastStep && (
            <Button
              onClick={goToNextStep}
              className="bg-white text-black hover:bg-emerald-400 hover:text-black transition-all duration-300 rounded-full px-8 py-6 text-base font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.5)]"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
