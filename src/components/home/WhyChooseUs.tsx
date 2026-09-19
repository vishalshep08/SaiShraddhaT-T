import React from "react";
import { ShieldCheck, PhoneCall, Car, MapPin } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: `Serving Shirdi Since ${BUSINESS_CONFIG.establishedYear}`,
    line: "Over a decade of trusted pilgrimage hospitality from Sai Ashram.",
  },
  {
    icon: PhoneCall,
    title: "Direct Owner Booking",
    line: "Speak directly with Ramesh Shep with honest, transparent pricing.",
  },
  {
    icon: Car,
    title: "Owned Ertiga & Tavera Fleet",
    line: "Directly maintained for safety, comfort, and pristine cleanliness.",
  },
  {
    icon: MapPin,
    title: "Local Shirdi Travel Experience",
    line: "Practical guidance on Aarti timings, temple routes, and highways.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <Badge variant="maroon" size="sm" className="mb-1.5">
          Local Trust
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
          Why Travel With Sai Shraddha?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRUST_POINTS.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2 hover:border-brand-maroon/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-maroon-50 text-brand-maroon flex items-center justify-center border border-brand-maroon-100 shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-brand-charcoal-900 leading-snug">
                  {pt.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {pt.line}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
