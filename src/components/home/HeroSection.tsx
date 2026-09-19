import React from "react";
import { ShieldCheck, MessageSquare, Phone, CheckCircle2 } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { getHeroFleetShowcaseAction } from "@/actions/fleetActions";
import { HeroFleetShowcase } from "./HeroFleetShowcase";
import { QuoteCTAButton } from "./QuoteCTAButton";

export async function HeroSection() {
  const ramesh = BUSINESS_CONFIG.contacts[0];
  const heroFleet = await getHeroFleetShowcaseAction();

  return (
    <section className="relative bg-gradient-to-b from-brand-ivory-200/80 via-brand-ivory-100 to-transparent pt-6 pb-10 sm:pt-12 sm:pb-14 border-b border-stone-200/70 overflow-hidden">
      {/* Tasteful Shirdi Sacred Watermark Graphic */}
      <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 pointer-events-none opacity-[0.035] select-none">
        <img
          src="/images/shirdi/sai-baba-emblem.svg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Hero Content & Conversion CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Primary H1 Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 leading-[1.15] tracking-tight">
                Taxi &amp; Tours From Shirdi
              </h1>
              <p className="text-lg sm:text-xl font-bold text-brand-maroon">
                Comfortable cabs for Darshan, Outstation &amp; Airport Travel
              </p>
            </div>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-brand-charcoal-600 leading-relaxed max-w-xl">
              Serving Shirdi since 2014 with direct owner coordination, clean vehicles and local travel experience.
            </p>

            {/* Conversion CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <QuoteCTAButton
                label="Get a Quote"
                size="lg"
                variant="primary"
                sourcePage="homepage_hero"
              />

              <a
                href={buildWhatsAppLink({
                  customMessage: `Hello Ramesh Shep, I would like to inquire about taxi service from Shirdi.`,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 font-semibold"
                  leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
                >
                  WhatsApp Ramesh
                </Button>
              </a>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-charcoal-700 pt-1 sm:pt-0">
                <Phone className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                <a
                  href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                  className="text-brand-maroon hover:underline font-bold"
                >
                  {ramesh.primaryPhone}
                </a>
              </div>
            </div>

            {/* Exactly 3 Genuine Trust Indicators */}
            <div className="pt-4 border-t border-stone-200/90 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>3 Ertiga + 1 Tavera</strong> Owned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Sai Ashram</strong>, Shirdi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Direct Owner</strong> Booking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Fleet Showcase */}
          <div className="lg:col-span-5 w-full">
            <HeroFleetShowcase vehicles={heroFleet} />
          </div>
        </div>
      </div>
    </section>
  );
}
