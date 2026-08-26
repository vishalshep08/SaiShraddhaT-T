import React from "react";
import Link from "next/link";
import { ShieldCheck, MessageSquare, Phone, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { VEHICLE_CATEGORIES, OWNED_FLEET_SUMMARY } from "@/data/fleetData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { VehicleCategoryCard } from "@/components/fleet/VehicleCategoryCard";
import { VehicleComparisonTable } from "@/components/fleet/VehicleComparisonTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "Our Fleet — Owned Ertiga, Tavera & On-Demand Cabs in Shirdi",
  description: "Explore the fleet options at Sai Shraddha Tours & Travels. 3 × Owned Maruti Ertiga, 1 × Owned Chevrolet Tavera, plus Sedans, Tempo Travellers, and Buses on request.",
  canonicalPath: "/fleet",
});

export default function FleetPage() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  const ownedVehicles = VEHICLE_CATEGORIES.filter((v) => v.isOwned);
  const networkVehicles = VEHICLE_CATEGORIES.filter((v) => !v.isOwned);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Hero Section */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-maroon" />
          <span>Fleet Transparency • Operating from Sai Ashram Since {BUSINESS_CONFIG.establishedYear}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
          Vehicles For Every Kind of Journey
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          From our directly owned family Ertigas and Taveras to on-demand Tempo Travellers and tour coaches, we ensure you have the right vehicle for a comfortable, air-conditioned journey from Shirdi.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppLink({
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to check vehicle availability and rates for a journey from Shirdi.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="md" variant="primary" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}>
              Check Fleet on WhatsApp
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="md" variant="outline" leftIcon={<Phone className="w-4 h-4 text-brand-maroon" />}>
              Call Ramesh: {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </div>

      {/* 2. OWNED FLEET SECTION */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-brand-charcoal-900">
                Our Owned Vehicles
              </h2>
              <Badge variant="green" size="sm">
                Directly Operated by Us
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              These vehicles are directly owned, maintained, and operated by Sai Shraddha Tours & Travels in Shirdi.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 shrink-0">
            4 Total Owned Vehicles in Shirdi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ownedVehicles.map((vehicle) => (
            <VehicleCategoryCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* 3. VEHICLES AVAILABLE ON REQUEST SECTION */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-brand-charcoal-900">
              Vehicles Available On Request
            </h2>
            <Badge variant="gray" size="sm">
              Verified Partner Network
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Arranged subject to confirmation through our network of verified, experienced Shirdi commercial drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {networkVehicles.map((vehicle) => (
            <VehicleCategoryCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* 4. CHOOSING THE RIGHT VEHICLE COMPARISON TABLE */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div>
          <Badge variant="maroon" size="sm" className="mb-1.5">Quick Comparison</Badge>
          <h2 className="text-2xl font-extrabold text-brand-charcoal-900">
            Choosing The Right Vehicle For Your Group
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Compare passenger capacities, luggage holds, and best use cases at a glance.
          </p>
        </div>

        <VehicleComparisonTable />

        <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            Passenger capacities indicate <strong>typical comfortable seating</strong>. For specialized group layouts or luggage carriers, speak with Ramesh Shep (Owner) before booking.
          </span>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="bg-brand-maroon text-white rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md space-y-6">
        <Badge variant="saffron" size="md">
          Direct Shirdi Booking Desk
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Need Help Selecting The Right Vehicle?
        </h2>
        <p className="text-sm sm:text-base text-brand-maroon-100 max-w-2xl mx-auto leading-relaxed">
          Tell us your passenger count, luggage requirements, and route. We will advise you on the most comfortable and cost-effective vehicle option.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={buildWhatsAppLink({
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I need help choosing a vehicle for my trip from Shirdi.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="saffron" leftIcon={<MessageSquare className="w-5 h-5 text-emerald-900" />}>
              Ask For Vehicle Recommendation
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" leftIcon={<Phone className="w-5 h-5 text-brand-saffron-300" />}>
              Call {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
