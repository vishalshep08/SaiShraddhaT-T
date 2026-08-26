import React from "react";
import { ShieldCheck, ArrowRight, MessageSquare, Phone, CheckCircle2, Sparkles } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { getHeroFleetShowcaseAction } from "@/actions/fleetActions";
import { HeroFleetShowcase } from "./HeroFleetShowcase";

export async function HeroSection() {
  const ramesh = BUSINESS_CONFIG.contacts[0];
  const heroFleet = await getHeroFleetShowcaseAction();

  return (
    <section className="relative bg-gradient-to-b from-brand-ivory-200/80 via-brand-ivory-100 to-transparent pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-stone-200/70 overflow-hidden">
      {/* Tasteful Shirdi Sacred Watermark Graphic (Background element) */}
      <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 pointer-events-none opacity-[0.04] select-none">
        <img
          src="/images/shirdi/sai-baba-emblem.svg"
          alt="Sai Baba Shirdi Sacred Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-brand-maroon shrink-0" />
              <span>Serving Customers in Shirdi Since {BUSINESS_CONFIG.establishedYear}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 leading-[1.18] tracking-tight">
              Taxi &amp; Travel Services From Shirdi,{" "}
              <span className="text-brand-maroon">Managed With Care &amp; Local Experience.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-brand-charcoal-600 leading-relaxed max-w-xl">
              Local temple transfers, holy pilgrimage darshans, outstation cabs across Maharashtra, airport pickups, and group vehicles. Operating continuously from <strong>Sai Ashram, Shirdi</strong> with our owned Ertiga &amp; Tavera fleet.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a href="#quick-enquiry">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get a Quote
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
                  className="border-emerald-600 text-emerald-800 bg-emerald-50/40 hover:bg-emerald-100"
                  leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
                >
                  WhatsApp Us
                </Button>
              </a>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-charcoal-800 pt-1 sm:pt-0">
                <Phone className="w-4 h-4 text-brand-maroon shrink-0" />
                <span>Call Owner:</span>
                <a
                  href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                  className="text-brand-maroon hover:underline font-bold"
                >
                  {ramesh.primaryPhone}
                </a>
              </div>
            </div>

            {/* Authentic Trust Points */}
            <div className="pt-5 border-t border-stone-200/90 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>3 × Ertiga &amp; 1 × Tavera</strong> Owned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Sai Ashram (Bhakta Niwas)</strong> Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Ramesh Shep (Owner)</strong> Direct</span>
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
