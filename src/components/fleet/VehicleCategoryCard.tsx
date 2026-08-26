import React from "react";
import { Users, Briefcase, Wind, ShieldCheck, CheckCircle2, MessageSquare } from "lucide-react";
import { VehicleCategoryItem } from "@/types/services";
import { buildWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface VehicleCategoryCardProps {
  vehicle: VehicleCategoryItem;
}

export function VehicleCategoryCard({ vehicle }: VehicleCategoryCardProps) {
  return (
    <div
      id={vehicle.slug}
      className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all space-y-6 shadow-sm ${
        vehicle.isOwned
          ? "bg-white border-brand-maroon/40 ring-1 ring-brand-maroon/10 hover:shadow-md"
          : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-brand-charcoal-900 leading-tight">
                {vehicle.name}
              </h3>
            </div>
            <p className="text-xs text-brand-maroon font-semibold mt-1">
              {vehicle.shortName}
            </p>
          </div>

          {vehicle.isOwned ? (
            <Badge variant="green" size="sm" className="shrink-0 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {vehicle.ownedCountText || "Owned Fleet"}
            </Badge>
          ) : (
            <Badge variant="gray" size="sm" className="shrink-0">
              Available On Request
            </Badge>
          )}
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {vehicle.description}
        </p>

        {/* Capacity & Specs Grid */}
        <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs text-stone-700">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Capacity</span>
            <div className="flex items-center gap-1 font-semibold text-brand-charcoal-900">
              <Users className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
              <span className="truncate">{vehicle.typicalCapacity}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Luggage</span>
            <div className="flex items-center gap-1 font-semibold text-brand-charcoal-900">
              <Briefcase className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
              <span className="truncate">{vehicle.luggageCapacity}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Climate</span>
            <div className="flex items-center gap-1 font-semibold text-brand-charcoal-900">
              <Wind className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
              <span className="truncate">{vehicle.acType}</span>
            </div>
          </div>
        </div>

        {/* Best For */}
        <div className="text-xs text-stone-600 bg-brand-ivory-100/70 p-2.5 rounded-lg border border-brand-ivory-300/60">
          <strong className="text-brand-charcoal-900">Best For:</strong> {vehicle.bestFor}
        </div>

        {/* Features Checklist */}
        <div className="space-y-1.5 pt-1">
          {vehicle.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <a
          href={buildWhatsAppLink({ vehicle: vehicle.name })}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            size="sm"
            variant={vehicle.isOwned ? "primary" : "outline"}
            className="w-full text-xs"
            leftIcon={<MessageSquare className="w-4 h-4" />}
          >
            {vehicle.isOwned ? "Book This Owned Vehicle" : "Check Vehicle Availability"}
          </Button>
        </a>
      </div>
    </div>
  );
}
