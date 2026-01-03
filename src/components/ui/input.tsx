"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full space-y-3">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-foreground block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-14 w-full rounded-xl border border-border bg-muted px-5 py-3 text-base text-foreground transition-all duration-200",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error focus:border-error focus:ring-error/20",
              icon && "pl-14",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-sm text-muted-foreground leading-relaxed">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
