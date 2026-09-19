import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

interface CompactPackage {
  name: string;
  slug: string;
  duration: string;
  startingFare: number;
  destinations: string;
}

const POPULAR_PACKAGES: CompactPackage[] = [
  {
    name: "Nashik & Trimbakeshwar",
    slug: "/packages/nashik-trimbakeshwar-darshan",
    duration: "1 Day",
    startingFare: 2600,
    destinations: "Trimbakeshwar • Panchavati • Muktidham",
  },
  {
    name: "Ellora & Grishneshwar",
    slug: "/packages/aurangabad-ellora-grishneshwar",
    duration: "1 Day",
    startingFare: 2800,
    destinations: "Grishneshwar • Ellora Caves • Bhadra Maruti",
  },
  {
    name: "Shani Shingnapur",
    slug: "/packages/shani-shingnapur-day-tour",
    duration: "Half Day",
    startingFare: 1800,
    destinations: "Shani Bhagwan Temple • Sugarcane Country",
  },
];

export function PackagesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-stone-200/80 pb-4">
        <div>
          <Badge variant="saffron" size="sm" className="mb-1.5">
            Darshan Tours
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
            Popular Pilgrimage Packages
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Carefully paced family darshan circuits with door-to-door cab coordination.
          </p>
        </div>

        <Link href="/packages" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Packages →
          </Button>
        </Link>
      </div>

      {/* 3 Compact Cards */}
      <HorizontalCarousel
        ariaLabel="Popular Pilgrimage Packages"
        autoplay={true}
        autoplayInterval={4000}
        resumeDelay={6000}
        desktopMode="grid"
        desktopGridCols="md:grid-cols-3"
        cardWidthMobile="w-[84vw] xs:w-[320px] sm:w-[350px]"
      >
        {POPULAR_PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className="h-full rounded-xl bg-white border border-stone-200/90 p-4 sm:p-5 flex flex-col justify-between hover:border-brand-maroon/40 hover:shadow-md transition-all space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-maroon bg-brand-maroon-50 px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3" />
                  {pkg.duration}
                </span>
                <span className="text-xs font-bold text-brand-charcoal-900">
                  From {formatINR(pkg.startingFare)}*
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-brand-charcoal-900 leading-snug">
                  {pkg.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  {pkg.destinations}
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
              <Link
                href={pkg.slug}
                className="text-xs font-bold text-brand-maroon hover:text-brand-maroon-800 flex items-center gap-1 hover:underline"
              >
                <span>View Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </HorizontalCarousel>
    </section>
  );
}
