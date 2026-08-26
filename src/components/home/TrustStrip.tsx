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
      subtitle: "Local on-ground presence at Bhakta Niwas",
    },
    {
      icon: Car,
      title: "Owned Fleet (3 Ertiga + 1 Tavera)",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-lg bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-md bg-brand-maroon-50 text-brand-maroon flex items-center justify-center shrink-0 mt-0.5 border border-brand-maroon-100">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-brand-charcoal-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 leading-normal">
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
