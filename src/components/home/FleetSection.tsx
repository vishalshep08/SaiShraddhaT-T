import React from "react";
import Link from "next/link";
import { Users, Briefcase, Wind, ShieldCheck, ArrowRight, MessageSquare } from "lucide-react";
import { FLEET_INFO } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function FleetSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-ivory-200/90 rounded-2xl p-6 sm:p-10 border border-stone-300 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-300 pb-6">
          <div className="max-w-2xl">
            <Badge variant="maroon" size="sm" className="mb-2">
              Fleet Transparency
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Our Vehicles & Capacity Options
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1">
              We own and maintain our core Ertiga and Tavera vehicles in Shirdi. For larger yatra groups or sedans, we coordinate with verified local drivers.
            </p>
          </div>

          <Link href="/fleet" className="shrink-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Full Fleet Details
            </Button>
          </Link>
        </div>

        {/* 1. OWNED VEHICLES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-brand-charcoal-900">
              Our Owned Fleet
            </h3>
            <Badge variant="green" size="sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Directly Maintained
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FLEET_INFO.owned.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-bold text-brand-charcoal-900">
                        {v.name}
                      </h4>
                      <p className="text-xs text-brand-maroon font-semibold mt-0.5">
                        {v.category}
                      </p>
                    </div>
                    <Badge variant="green" size="sm">Owned</Badge>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {v.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-maroon shrink-0" />
                      <span>{v.seating}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-brand-maroon shrink-0" />
                      <span>{v.luggage}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-brand-maroon shrink-0" />
                      <span>{v.ac}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Ideal for: <strong>{v.idealFor.split(",")[0]}</strong>
                  </span>
                  <a
                    href={buildWhatsAppLink({ vehicle: v.name })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Book Vehicle
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. ON-REQUEST NETWORK VEHICLES */}
        <div className="space-y-4 pt-4 border-t border-stone-300">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-brand-charcoal-900">
              Vehicles Available On Request (Verified Partner Network)
            </h3>
            <span className="text-xs text-stone-500 font-medium italic">
              • Available subject to confirmation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLEET_INFO.network.map((nv, idx) => (
              <div
                key={idx}
                className="bg-white/80 rounded-lg p-4 border border-stone-200 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-brand-charcoal-900">
                    {nv.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {nv.seating} • {nv.luggage}
                  </p>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {nv.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <a
                    href={buildWhatsAppLink({ vehicle: nv.name })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-brand-maroon hover:underline flex items-center gap-1"
                  >
                    Check Availability →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
