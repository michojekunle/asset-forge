"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loader({ size = "md", text, className }: LoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const logoSizes = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Loading"
            width={logoSizes[size]}
            height={logoSizes[size]}
            className="object-contain"
          />
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-neutral-500">{text}</p>
      )}
    </div>
  );
}

// Full page loader
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  );
}
