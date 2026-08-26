import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-700"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md border border-stone-300 bg-white px-3.5 py-2 text-sm text-brand-charcoal focus:border-brand-maroon focus:outline-none focus:ring-1 focus:ring-brand-maroon disabled:cursor-not-allowed disabled:bg-stone-50 transition-colors",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-stone-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
