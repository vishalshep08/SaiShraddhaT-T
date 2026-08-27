import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { POPULAR_DESTINATIONS } from "@/lib/constants";
import { buildWhatsAppLink, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

export function DestinationsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 border-b border-stone-200/80 pb-4">
        <div>
          <Badge variant="maroon" size="sm" className="mb-2">
            Popular Outstation & Pilgrimage Routes
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
            Direct Cab Routes From Shirdi
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Clean air-conditioned Ertiga & Tavera cabs with experienced highway drivers and transparent starting rates.
          </p>
        </div>

        <Link href="/destinations" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            All Destinations
          </Button>
        </Link>
      </div>

      <HorizontalCarousel
        ariaLabel="Popular Outstation and Pilgrimage Destinations from Shirdi"
        autoplay={true}
        autoplayInterval={4500}
        desktopMode="grid"
        desktopGridCols="md:grid-cols-2 lg:grid-cols-4"
      >
        {POPULAR_DESTINATIONS.map((dest) => (
          <div
            key={dest.slug}
            className="h-full rounded-xl bg-white border border-stone-200/90 p-5 flex flex-col justify-between hover:border-brand-maroon/40 hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base text-brand-charcoal-900 leading-snug">
                  {dest.name}
                </h3>
                <span className="text-xs font-bold text-brand-maroon bg-brand-maroon-50 px-2 py-0.5 rounded shrink-0">
                  {formatINR(dest.startingFare)}*
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {dest.distanceKm} km
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {dest.approxTravelTime}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {dest.shortDescription}
              </p>

              <div className="pt-2 space-y-1">
                {dest.highlights.slice(0, 2).map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <a
                href={buildWhatsAppLink({ drop: dest.name })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Plan Journey</span>
              </a>

              <Link
                href={`/destinations#${dest.slug}`}
                className="text-xs font-medium text-brand-maroon hover:underline"
              >
                View Route →
              </Link>
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      <div className="mt-4 text-center text-xs text-stone-500">
        *Starting fares indicative for one-way/roundtrip Ertiga & Sedan cabs. Toll and parking extra as applicable.
      </div>
    </section>
  );
}
