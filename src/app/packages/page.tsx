import React from "react";
import Link from "next/link";
import { ShieldCheck, Clock, MapPin, ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";
import { TOUR_PACKAGES_DATA } from "@/data/packagesData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "Pilgrimage Tour Packages From Shirdi | Jyotirlinga & Darshan Tours",
  description: "Curated pilgrimage tour packages from Shirdi with Sai Shraddha Tours & Travels. Nashik-Trimbakeshwar, Ellora-Grishneshwar, Shani Shingnapur, and 5 Maharashtra Jyotirlingas.",
  canonicalPath: "/packages",
});

export default function PackagesPage() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Hero */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-maroon" />
          <span>Spiritual Darshan & Yatra Desk • Est. {BUSINESS_CONFIG.establishedYear}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
          Pilgrimage Tour Packages From Shirdi
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Sacred darshan circuits planned with care and patience for families, senior citizens, and devotee groups. Clean air-conditioned Ertiga, Tavera, and Tempo Traveller vehicles with knowledgeable local drivers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppLink({
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about pilgrimage tour packages from Shirdi.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="md" variant="primary" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}>
              Customise Yatra on WhatsApp
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="md" variant="outline">
              Call Ramesh: {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </div>

      {/* 2. Packages Grid */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              Curated Holy Darshan Circuits
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Click on any package for full itinerary details, holy places covered, and vehicle options.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOUR_PACKAGES_DATA.map((pkg) => (
            <div
              key={pkg.slug}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon bg-brand-maroon-50 px-2.5 py-1 rounded-md border border-brand-maroon-100">
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.durationText}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                    {pkg.packageType.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-charcoal-900 leading-snug">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-brand-maroon font-semibold mt-1">
                    Covers: {pkg.destinationsCovered.join(" • ")}
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {pkg.shortDescription}
                </p>

                {/* Places covered preview */}
                <div className="pt-2 border-t border-stone-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                    Key Holy Sites:
                  </span>
                  {pkg.placesCoveredDetails.slice(0, 3).map((place, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-maroon shrink-0 mt-0.5" />
                      <span className="font-semibold text-brand-charcoal-900">{place.placeName}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <a
                  href={buildWhatsAppLink({
                    drop: pkg.title,
                    customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about the ${pkg.title} from Shirdi.`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Enquire Now
                </a>

                <Link href={`/packages/${pkg.slug}`}>
                  <Button size="sm" variant="primary" className="text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Itinerary
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
