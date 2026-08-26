import React from "react";
import { ShieldCheck, MapPin, Users, HeartHandshake, Receipt, PhoneCall } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function WhyChooseUs() {
  const points = [
    {
      icon: ShieldCheck,
      title: `Serving Since ${BUSINESS_CONFIG.establishedYear}`,
      desc: "More than a decade of continuous offline service right here in Shirdi. We are a family-run local agency, not a faceless aggregator.",
    },
    {
      icon: MapPin,
      title: "Intimate Local Temple Knowledge",
      desc: "Our drivers know Aarti timings, Darshan queue entry gates, VIP pass procedures, and best parking spots in Shirdi, Nashik, and Shani Shingnapur.",
    },
    {
      icon: Receipt,
      title: "Transparent, Upfront Quotations",
      desc: "Clear per-km or package rates with no unexpected extra charges at the end of your trip. Exact quotes confirmed before you step into the cab.",
    },
    {
      icon: Users,
      title: "Elderly & Family-Friendly Pacing",
      desc: "We understand that pilgrimage journeys are holy and should never be rushed. Ample rest stops, gentle driving, and luggage support.",
    },
    {
      icon: PhoneCall,
      title: "Direct Access to Owner",
      desc: "You can speak directly with Ramesh Shep (Owner) on the phone or visit our Sai Ashram desk at any time during your stay.",
    },
    {
      icon: HeartHandshake,
      title: "Doorstep Ashram & Hotel Pickup",
      desc: "Whether you are staying at Sai Ashram (Bhakta Niwas), a local hotel, or arriving at the railway station, your cab arrives at your doorstep.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="maroon" size="sm" className="mb-2">
          Grounded Trust & Local Care
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
          Why Pilgrims & Travellers Choose Sai Shraddha
        </h2>
        <p className="text-sm sm:text-base text-stone-600 mt-2">
          Real local hospitality built through thousands of offline journeys across Maharashtra since 2014.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3 hover:border-brand-maroon/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-maroon-50 text-brand-maroon flex items-center justify-center border border-brand-maroon-100">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-base text-brand-charcoal-900 leading-snug">
                {p.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
