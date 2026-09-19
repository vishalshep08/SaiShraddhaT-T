import React from "react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuoteCTAButton } from "./QuoteCTAButton";
import { MessageSquare } from "lucide-react";

export function BusinessStory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl bg-gradient-to-r from-brand-maroon via-brand-maroon-800 to-brand-maroon-900 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-md border border-brand-maroon-700">
        {/* Subtle Sacred Graphic Background Watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 w-64 h-64 sm:w-80 sm:h-80 opacity-10 pointer-events-none select-none">
          <img
            src="/images/shirdi/sai-baba-emblem.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-maroon-700/80 text-brand-saffron-300 text-xs font-semibold border border-brand-maroon-600">
            <span>Sai Ashram (Bhakta Niwas), Shirdi</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Your Journey Begins in Shirdi
          </h2>

          <p className="text-sm sm:text-base text-brand-maroon-100 leading-relaxed">
            From Sai Baba darshan to Maharashtra pilgrimage circuits and outstation travel, we help you travel comfortably from Shirdi.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <QuoteCTAButton
              label="Plan Your Journey"
              size="md"
              variant="saffron"
              className="bg-brand-saffron hover:bg-brand-saffron-600 text-brand-charcoal-900 font-bold"
              sourcePage="shirdi_visual_section"
            />

            <a
              href={buildWhatsAppLink({
                customMessage: `Hello Ramesh Shep, I am planning a pilgrimage journey from Shirdi and need cab assistance.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="md"
                variant="outline"
                className="border-brand-maroon-400 text-white hover:bg-brand-maroon-700 font-semibold"
                leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}
              >
                WhatsApp Ramesh
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
