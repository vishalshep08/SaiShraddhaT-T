import React from "react";
import Link from "next/link";
import { ArrowRight, Car, Navigation, Plane, Compass } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

interface ServiceCardData {
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
}

const CONCISE_SERVICES: ServiceCardData[] = [
  {
    title: "Shirdi Darshan & Local Taxi",
    slug: "shirdi-local-taxi",
    description:
      "Easy hotel, Sai Ashram and temple transfers with clean, comfortable local cabs.",
    icon: Car,
  },
  {
    title: "Outstation Cab Service",
    slug: "outstation-taxi",
    description:
      "Reliable one-way and roundtrip highway cabs across Maharashtra with experienced drivers.",
    icon: Navigation,
  },
  {
    title: "Airport & Railway Transfers",
    slug: "airport-transfer",
    description:
      "Punctual pickups and drops for Shirdi Airport (SAG), Sainagar Station, Kopargaon & Manmad.",
    icon: Plane,
  },
  {
    title: "Pilgrimage & Group Tours",
    slug: "pilgrimage-tours",
    description:
      "Spiritual darshan circuits and spacious group vehicles for seamless family yatras.",
    icon: Compass,
  },
];

export function ServicesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-stone-200/80 pb-4">
        <div>
          <Badge variant="saffron" size="sm" className="mb-1.5">
            Core Services
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
            Travel Services From Shirdi
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Tailored travel solutions with verified local experience and direct owner coordination.
          </p>
        </div>

        <Link href="/services" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Services →
          </Button>
        </Link>
      </div>

      {/* 4 Concise Cards: Single Responsive DOM */}
      <HorizontalCarousel
        ariaLabel="Travel Services From Shirdi"
        autoplay={true}
        autoplayInterval={4500}
        resumeDelay={6000}
        desktopMode="grid"
        desktopGridCols="md:grid-cols-2 lg:grid-cols-4"
        cardWidthMobile="w-[84vw] xs:w-[320px] sm:w-[350px]"
      >
        {CONCISE_SERVICES.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div
              key={service.slug}
              className="h-full rounded-xl bg-white border border-stone-200/90 p-5 flex flex-col justify-between hover:border-brand-maroon/40 hover:shadow-md transition-all space-y-3"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-maroon-50 text-brand-maroon flex items-center justify-center border border-brand-maroon-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-300">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-brand-charcoal-900 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-brand-maroon hover:text-brand-maroon-800 inline-flex items-center gap-1 hover:underline"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </HorizontalCarousel>
    </section>
  );
}
