import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES_DATA } from "@/data/servicesData";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "Taxi & Travel Services in Shirdi",
  description: "Explore all taxi, cab and pilgrimage travel services by Sai Shraddha Tours & Travels. Local Shirdi cabs, outstation taxis, airport drops, Jyotirlinga tours, and group Tempo Travellers.",
  canonicalPath: "/services",
});

export default function ServicesPage() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header Hero */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-maroon" />
          <span>Serving Shirdi Since {BUSINESS_CONFIG.establishedYear} • Sai Ashram Desk</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
          Taxi & Travel Services From Shirdi
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          From local temple transfers and full-day Shirdi sightseeing to long-distance Maharashtra outstation cabs, airport transfers, and group Tempo Travellers. Clean, air-conditioned vehicles driven by polite, experienced local drivers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppLink({ customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about your travel services from Shirdi.` })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="md" variant="primary" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}>
              Enquire on WhatsApp
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="md" variant="outline" leftIcon={<Phone className="w-4 h-4 text-brand-maroon" />}>
              Call Ramesh: {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </div>

      {/* 2. Structured Services Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              Our 8 Primary Travel Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Select any service to view full itinerary options, vehicle options, and FAQs.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-maroon hidden sm:inline">
            8 Services Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {SERVICES_DATA.map((service, index) => (
            <ServiceCard
              key={service.slug}
              service={service}
              featured={index === 0 || index === 2}
            />
          ))}
        </div>
      </div>

      {/* 3. Fleet Cross-Link Section */}
      <div className="bg-brand-ivory-200/90 rounded-2xl p-8 sm:p-10 border border-stone-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <Badge variant="maroon" size="sm">Vehicle Fleet Transparency</Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-brand-charcoal-900">
            Wondering Which Vehicle Fits Your Family?
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            We own and operate our primary <strong>3 × Maruti Ertiga</strong> and <strong>1 × Chevrolet Tavera</strong> fleet in Shirdi, and coordinate Sedans and Tempo Travellers for larger groups.
          </p>
        </div>

        <Link href="/fleet" className="shrink-0">
          <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Fleet & Capacities
          </Button>
        </Link>
      </div>

      {/* 4. Direct Closing CTA */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-6 border-t border-stone-200">
        <h3 className="text-2xl font-bold text-brand-charcoal-900">
          Need a Custom Route Not Listed Here?
        </h3>
        <p className="text-sm text-stone-600">
          Speak directly with Ramesh Shep (Owner). We arrange customized itineraries across all districts of Maharashtra.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="md" variant="outline">
              Call Ramesh Shep: {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
