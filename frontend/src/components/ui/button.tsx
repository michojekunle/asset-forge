"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-black rounded-full hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-transparent border border-neutral-700 text-white rounded-full hover:border-neutral-500 hover:bg-white/[0.02]",
        outline:
          "border border-neutral-700 bg-transparent text-white rounded-full hover:bg-white/[0.02]",
        ghost:
          "bg-transparent text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded-lg",
        accent:
          "bg-neutral-800 text-white rounded-full hover:bg-neutral-700",
        success:
          "bg-green-600 text-white rounded-full hover:bg-green-500",
        danger:
          "bg-red-600 text-white rounded-full hover:bg-red-500",
      },
      size: {
        sm: "h-9 px-5 text-sm",
        md: "h-11 px-7 text-sm",
        lg: "h-12 px-8 text-[15px]",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10 rounded-lg",
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
            <span className="spinner h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
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
