import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "saffron" | "outline" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 select-none active:scale-[0.99]";

    const variantStyles = {
      // Primary: Deep Maroon (pilgrimage & trust heritage)
      primary:
        "bg-brand-maroon text-white hover:bg-brand-maroon-800 focus-visible:ring-brand-maroon shadow-sm",
      // Saffron: Warm Muted Orange (used sparingly for key CTAs)
      saffron:
        "bg-brand-saffron text-white hover:bg-brand-saffron-600 focus-visible:ring-brand-saffron shadow-sm",
      // Outline
      outline:
        "border border-brand-charcoal-700/20 bg-transparent text-brand-charcoal hover:bg-brand-ivory-200/60 focus-visible:ring-brand-maroon",
      // Secondary
      secondary:
        "bg-brand-ivory-200 text-brand-charcoal hover:bg-brand-ivory-300 focus-visible:ring-brand-charcoal",
      // Ghost
      ghost:
        "text-brand-charcoal hover:bg-brand-ivory-200/70 focus-visible:ring-brand-maroon",
      // Link
      link:
        "text-brand-maroon underline-offset-4 hover:underline p-0 h-auto font-medium",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-md gap-1.5",
      md: "h-11 px-5 text-sm rounded-md gap-2",
      lg: "h-12 px-6 text-base rounded-md gap-2.5",
    };

    return (
      <button
        ref={ref}
        suppressHydrationWarning
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          variant !== "link" && sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
