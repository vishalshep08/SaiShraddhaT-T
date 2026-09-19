import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, MessageSquare } from "lucide-react";
import { buildWhatsAppLink, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

interface FeaturedRoute {
  name: string;
  routeSlug: string;
  distanceKm: number;
  travelTime: string;
  startingFare: number;
  highlightStop: string;
}

const FEATURED_ROUTES: FeaturedRoute[] = [
  {
    name: "Shirdi → Shani Shingnapur",
    routeSlug: "/routes/shirdi-to-shani-shingnapur",
    distanceKm: 72,
    travelTime: "1.5–2 hrs",
    startingFare: 1800,
    highlightStop: "Lord Shani Dev Temple Darshan",
  },
  {
    name: "Shirdi → Nashik & Trimbakeshwar",
    routeSlug: "/routes/shirdi-to-trimbakeshwar",
    distanceKm: 115,
    travelTime: "2.5–3 hrs",
    startingFare: 2600,
    highlightStop: "Trimbakeshwar Jyotirlinga & Panchavati",
  },
  {
    name: "Shirdi → Ellora & Grishneshwar",
    routeSlug: "/routes/shirdi-to-aurangabad",
    distanceKm: 110,
    travelTime: "2.5–3 hrs",
    startingFare: 2800,
    highlightStop: "Grishneshwar Jyotirlinga & Ellora Caves",
  },
  {
    name: "Shirdi → Pune",
    routeSlug: "/routes/shirdi-to-pune",
    distanceKm: 200,
    travelTime: "4–4.5 hrs",
    startingFare: 3800,
    highlightStop: "Direct City, Railway & Airport Drop",
  },
  {
    name: "Shirdi → Mumbai",
    routeSlug: "/routes/shirdi-to-mumbai",
    distanceKm: 240,
    travelTime: "4.5–5 hrs",
    startingFare: 4500,
    highlightStop: "Via Samruddhi Mahamarg Express",
  },
  {
    name: "Shirdi → Ajanta Caves",
    routeSlug: "/routes/shirdi-to-aurangabad",
    distanceKm: 210,
    travelTime: "4.5–5 hrs",
    startingFare: 4800,
    highlightStop: "Ancient UNESCO Buddhist Rock Caves",
  },
];

export function DestinationsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-stone-200/80 pb-4">
        <div>
          <Badge variant="maroon" size="sm" className="mb-1.5">
            Where Do You Want To Go?
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
            Popular Taxi Routes From Shirdi
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Comfortable outstation cabs with transparent starting fares and experienced local drivers.
          </p>
        </div>

        <Link href="/routes" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Routes →
          </Button>
        </Link>
      </div>

      {/* 6 Concise Route Cards - Single Responsive DOM */}
      <HorizontalCarousel
        ariaLabel="Popular taxi routes from Shirdi"
        autoplay={false}
        desktopMode="grid"
        desktopGridCols="md:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURED_ROUTES.map((route) => (
          <div
            key={route.name}
            className="h-full rounded-xl bg-white border border-stone-200/90 p-4 sm:p-5 flex flex-col justify-between hover:border-brand-maroon/40 hover:shadow-md transition-all space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base text-brand-charcoal-900 leading-snug">
                  {route.name}
                </h3>
                <span className="text-xs font-bold text-brand-maroon bg-brand-maroon-50 px-2 py-0.5 rounded shrink-0">
                  From {formatINR(route.startingFare)}*
                </span>
              </div>

              {/* Short Route Metrics */}
              <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {route.distanceKm} km
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {route.travelTime}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-snug">
                {route.highlightStop}
              </p>
            </div>

            {/* Concise Actions */}
            <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
              <a
                href={buildWhatsAppLink({
                  drop: route.name.replace("Shirdi → ", ""),
                  customMessage: `Hello Ramesh Shep, I would like to plan a trip for ${route.name}.`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Plan Journey</span>
              </a>

              <Link
                href={route.routeSlug}
                className="text-xs font-medium text-brand-maroon hover:underline flex items-center gap-0.5"
              >
                <span>View Route</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      <div className="mt-3 text-center text-xs text-stone-500">
        *Starting fares indicative for clean AC Ertiga/Sedan cabs. Toll and parking extra as applicable.
      </div>
    </section>
  );
}
