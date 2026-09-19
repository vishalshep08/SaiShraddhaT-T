import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, MessageSquare, Users, Wind } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getHeroFleetShowcaseAction } from "@/actions/fleetActions";
import { buildWhatsAppLink } from "@/lib/utils";

export async function FleetSection() {
  const heroFleet = await getHeroFleetShowcaseAction();

  const ertiga = heroFleet.find((v) => v.name.toLowerCase().includes("ertiga")) || {
    name: "Maruti Suzuki Ertiga",
    imageUrl: "/images/fleet/ertiga-fallback.svg",
    altText: "Maruti Suzuki Ertiga Shirdi taxi",
  };

  const tavera = heroFleet.find((v) => v.name.toLowerCase().includes("tavera")) || {
    name: "Chevrolet Tavera",
    imageUrl: "/images/fleet/tavera-fallback.svg",
    altText: "Chevrolet Tavera Shirdi cab",
  };

  const ownedVehicles = [
    {
      name: "Maruti Suzuki Ertiga",
      vehicleCount: "3 Vehicles",
      seating: "6+1 Seater",
      ac: "Air Conditioned",
      status: "Owned Fleet",
      imageUrl: ertiga.imageUrl || "/images/fleet/ertiga-fallback.svg",
      altText: ertiga.altText || "Maruti Suzuki Ertiga taxi in Shirdi",
    },
    {
      name: "Chevrolet Tavera",
      vehicleCount: "1 Vehicle",
      seating: "7+1 / 8+1 Seater",
      ac: "Air Conditioned",
      status: "Owned Fleet",
      imageUrl: tavera.imageUrl || "/images/fleet/tavera-fallback.svg",
      altText: tavera.altText || "Chevrolet Tavera cab in Shirdi",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-ivory-200/70 rounded-2xl p-5 sm:p-8 border border-stone-200 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-300/70 pb-4">
          <div>
            <Badge variant="maroon" size="sm" className="mb-1.5">
              Verified Fleet
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Our Owned Vehicles
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Vehicles maintained by us in Shirdi for comfortable family and pilgrimage travel.
            </p>
          </div>

          <Link href="/fleet" className="shrink-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Full Fleet →
            </Button>
          </Link>
        </div>

        {/* Owned Vehicles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {ownedVehicles.map((v) => (
            <div
              key={v.name}
              className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-4 hover:border-brand-maroon/40 transition-colors"
            >
              <div className="w-full sm:w-44 h-32 shrink-0 bg-stone-50 rounded-lg p-2 flex items-center justify-center border border-stone-100">
                <img
                  src={v.imageUrl}
                  alt={v.altText}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="w-full space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-brand-charcoal-900">
                      {v.name}
                    </h3>
                    <span className="text-xs font-semibold text-brand-maroon">
                      {v.vehicleCount}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Owned</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{v.seating}</span>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-stone-400" />
                    <span>{v.ac}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <a
                    href={buildWhatsAppLink({
                      vehicle: v.name,
                      customMessage: `Hello Ramesh Shep, I would like to book the ${v.name} for travel from Shirdi.`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Book Vehicle</span>
                  </a>

                  <Link
                    href="/fleet"
                    className="text-xs font-medium text-brand-maroon hover:underline flex items-center gap-0.5"
                  >
                    <span>Specs</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Network Note */}
        <div className="bg-white/80 rounded-xl p-3.5 sm:p-4 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-brand-charcoal-900 block sm:inline mr-1.5">
              Need a larger vehicle?
            </span>
            <span className="text-stone-600">
              Tempo Travellers, buses, sedans and other vehicles are available through our verified local network.
            </span>
          </div>

          <Link
            href="/fleet"
            className="shrink-0 text-brand-maroon font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Fleet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
