import React from "react";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuoteCTAButton } from "./QuoteCTAButton";

export function FinalCTA() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-maroon text-white rounded-2xl p-6 sm:p-10 lg:p-12 text-center max-w-4xl mx-auto shadow-lg space-y-5 border border-brand-maroon-800">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Planning a Trip From Shirdi?
          </h2>
          <p className="text-sm sm:text-base text-brand-maroon-100 leading-relaxed">
            Tell us your destination, travel date and vehicle requirement. Ramesh Shep will help you plan the journey.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <QuoteCTAButton
            label="Get a Quote"
            size="lg"
            variant="saffron"
            className="bg-brand-saffron hover:bg-brand-saffron-600 text-brand-charcoal-900 font-bold"
            sourcePage="homepage_final_cta"
          />

          <a
            href={buildWhatsAppLink({
              customMessage: `Hello Ramesh Shep, I am planning a journey from Shirdi and would like to get a quote.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-400 bg-emerald-700/60 text-white hover:bg-emerald-600 font-semibold"
              leftIcon={<MessageSquare className="w-5 h-5 text-emerald-300" />}
            >
              WhatsApp Ramesh
            </Button>
          </a>
        </div>

        {/* Phone Contact */}
        <div className="pt-4 border-t border-brand-maroon-800/80 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-brand-maroon-100">
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-brand-saffron-300" />
            <span>Ramesh Shep (Owner):</span>
            <a
              href={buildPhoneLink(ramesh.primaryPhoneRaw)}
              className="text-white font-bold hover:text-brand-saffron-200 underline-offset-2 hover:underline font-mono"
            >
              {ramesh.primaryPhone}
            </a>
          </div>

          <span className="text-brand-maroon-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1 text-xs text-brand-maroon-200">
            <MapPin className="w-3.5 h-3.5 text-brand-saffron-300" />
            <span>Sai Ashram (Bhakta Niwas), Shirdi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
