import React from "react";
import { Phone, MessageSquare, ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-maroon text-white rounded-2xl p-8 sm:p-14 text-center max-w-5xl mx-auto shadow-lg space-y-7 border border-brand-maroon-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-maroon-800/90 text-brand-saffron-300 text-xs font-semibold border border-brand-maroon-700">
          <ShieldCheck className="w-4 h-4 text-brand-saffron-300" />
          <span>Local Travel Desk in Shirdi • Est. {BUSINESS_CONFIG.establishedYear}</span>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Planning Your Journey From Shirdi?
          </h2>
          <p className="text-sm sm:text-base text-brand-maroon-100 leading-relaxed">
            Tell us where you are going, when you are travelling, and how many passengers are with you. We will help you arrange the right clean vehicle with a prompt, transparent quote.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <a href="#quick-enquiry">
            <Button
              size="lg"
              variant="saffron"
              className="bg-brand-saffron hover:bg-brand-saffron-600 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get a Quote Now
            </Button>
          </a>

          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-400 bg-emerald-700/60 text-white hover:bg-emerald-600"
              leftIcon={<MessageSquare className="w-5 h-5 text-emerald-300" />}
            >
              WhatsApp Us Directly
            </Button>
          </a>
        </div>

        {/* Verified Direct Call */}
        <div className="pt-6 border-t border-brand-maroon-800/80 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-brand-maroon-100">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-saffron-300" />
            <span>Ramesh Shep (Owner):</span>
            <a
              href={buildPhoneLink(ramesh.primaryPhoneRaw)}
              className="text-white font-bold hover:text-brand-saffron-200 underline-offset-2 hover:underline font-mono"
            >
              {ramesh.primaryPhone}
            </a>
          </div>
        </div>

        <div className="text-xs text-brand-maroon-300 pt-2 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-saffron-300" />
          <span>{BUSINESS_CONFIG.address}</span>
        </div>
      </div>
    </section>
  );
}
