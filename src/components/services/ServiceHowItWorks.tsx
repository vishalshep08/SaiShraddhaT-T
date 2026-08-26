import React from "react";
import { ServiceStep } from "@/types/services";

interface ServiceHowItWorksProps {
  steps: ServiceStep[];
}

export function ServiceHowItWorks({ steps }: ServiceHowItWorksProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-charcoal-900">
          How It Works
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Simple, direct, and transparent booking process from Shirdi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-5 rounded-xl bg-white border border-stone-200/90 shadow-xs space-y-2.5 relative flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-brand-maroon text-white flex items-center justify-center font-bold text-xs">
                0{step.stepNumber}
              </div>
              <h4 className="font-bold text-sm text-brand-charcoal-900 leading-snug">
                {step.title}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
