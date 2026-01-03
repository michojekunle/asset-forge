"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 text-white shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-muted border border-border text-foreground hover:bg-muted/80 hover:border-primary/50",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/50",
        ghost:
          "bg-transparent text-foreground hover:bg-muted",
        accent:
          "bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-0.5",
        success:
          "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5",
        danger:
          "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="spinner h-4 w-4 border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
