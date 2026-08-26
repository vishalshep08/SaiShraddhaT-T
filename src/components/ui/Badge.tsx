import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "maroon" | "saffron" | "green" | "gray" | "outline" | "blue" | "red";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "maroon",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    maroon: "bg-brand-maroon-50 text-brand-maroon-800 border-brand-maroon-200",
    saffron: "bg-brand-saffron-50 text-brand-saffron-800 border-brand-saffron-200",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    red: "bg-rose-50 text-rose-800 border-rose-200",
    gray: "bg-stone-100 text-brand-charcoal-700 border-stone-200",
    outline: "bg-transparent text-brand-charcoal border-brand-charcoal/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs tracking-wide",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-md border",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
