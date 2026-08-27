import React from "react";
import { ShieldCheck, MapPin, Car, PhoneCall } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";

export function TrustStrip() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: `Serving Since ${BUSINESS_CONFIG.establishedYear}`,
      subtitle: "Over a decade of genuine Shirdi travel service",
    },
    {
      icon: MapPin,
      title: "Sai Ashram, Shirdi Office",
      subtitle: "Local on-ground desk at Bhakta Niwas",
    },
    {
      icon: Car,
      title: "Owned Fleet (Ertiga & Tavera)",
      subtitle: "Maintained, air-conditioned & sanitized",
    },
    {
      icon: PhoneCall,
      title: "Direct Owner Coordination",
      subtitle: "Speak with Ramesh Shep (Owner)",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 sm:p-5 rounded-xl bg-white border border-stone-200/90 shadow-xs flex items-start gap-3 hover:border-brand-maroon/30 transition-colors"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-maroon-50 text-brand-maroon flex items-center justify-center shrink-0 mt-0.5 border border-brand-maroon-100">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-brand-charcoal-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
