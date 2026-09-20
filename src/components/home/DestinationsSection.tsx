import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, MessageSquare } from "lucide-react";
import { buildWhatsAppLink, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

interface FeaturedRoute {
  name: string;
  shortName: string;
  routeSlug: string;
  distanceKm: number;
  travelTime: string;
  startingFare: number;
  categoryTag: string;
  imageUrl: string;
  imageAlt: string;
}

const FEATURED_ROUTES: FeaturedRoute[] = [
  {
    name: "Shirdi → Shani Shingnapur",
    shortName: "Shani Shingnapur",
    routeSlug: "/routes/shirdi-to-shani-shingnapur",
    distanceKm: 72,
    travelTime: "1.5–2 hrs",
    startingFare: 1800,
    categoryTag: "Pilgrimage",
    imageUrl: "/images/destinations/shani-shingnapur.jpg",
    imageAlt: "Shani Shingnapur holy temple open air platform",
  },
  {
    name: "Shirdi → Nashik & Trimbakeshwar",
    shortName: "Nashik & Trimbakeshwar",
    routeSlug: "/routes/shirdi-to-trimbakeshwar",
    distanceKm: 115,
    travelTime: "2.5–3 hrs",
    startingFare: 2600,
    categoryTag: "Jyotirlinga & Ghats",
    imageUrl: "/images/destinations/trimbakeshwar.jpg",
    imageAlt: "Trimbakeshwar Shiva Jyotirlinga Temple",
  },
  {
    name: "Shirdi → Ellora & Grishneshwar",
    shortName: "Ellora & Grishneshwar",
    routeSlug: "/routes/shirdi-to-ellora-caves",
    distanceKm: 110,
    travelTime: "2.5–3 hrs",
    startingFare: 2800,
    categoryTag: "12th Jyotirlinga & UNESCO",
    imageUrl: "/images/destinations/ellora-caves.jpg",
    imageAlt: "Ellora Kailash Monolithic Cave Temple",
  },
  {
    name: "Shirdi → Pune",
    shortName: "Pune City & Airport",
    routeSlug: "/routes/shirdi-to-pune",
    distanceKm: 200,
    travelTime: "4–4.5 hrs",
    startingFare: 3800,
    categoryTag: "City & Airport Drop",
    imageUrl: "/images/destinations/pune.jpg",
    imageAlt: "Pune Shaniwar Wada and city skyline",
  },
  {
    name: "Shirdi → Mumbai",
    shortName: "Mumbai via Expressway",
    routeSlug: "/routes/shirdi-to-mumbai",
    distanceKm: 240,
    travelTime: "4.5–5 hrs",
    startingFare: 4500,
    categoryTag: "Samruddhi Mahamarg",
    imageUrl: "/images/destinations/mumbai.jpg",
    imageAlt: "Gateway of India and Mumbai harbour",
  },
  {
    name: "Shirdi → Ajanta Caves",
    shortName: "Ajanta Caves",
    routeSlug: "/routes/shirdi-to-ajanta-caves",
    distanceKm: 210,
    travelTime: "4.5–5 hrs",
    startingFare: 4800,
    categoryTag: "World Heritage Caves",
    imageUrl: "/images/destinations/ajanta-caves.jpg",
    imageAlt: "Ajanta Caves horseshoe gorge rock architecture",
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
            Popular Taxi Routes & Destinations From Shirdi
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Choose your sacred destination. Clean outstation cabs, experienced drivers, and upfront fares.
          </p>
        </div>

        <Link href="/routes" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Routes →
          </Button>
        </Link>
      </div>

      {/* 6 Image-First Destination Cards - Single Responsive DOM */}
      <HorizontalCarousel
        ariaLabel="Popular destinations and taxi routes from Shirdi"
        autoplay={true}
        autoplayInterval={4000}
        resumeDelay={6000}
        cardWidthMobile="w-[84vw] xs:w-[320px] sm:w-[350px]"
        desktopMode="grid"
        desktopGridCols="md:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURED_ROUTES.map((route) => (
          <div
            key={route.name}
            className="group h-full rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* 1. Landmark Photo with Badges */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
              <Image
                src={route.imageUrl}
                alt={route.imageAlt}
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                  {route.categoryTag}
                </span>
              </div>

              {/* Price Tag Pill */}
              <div className="absolute top-3 right-3">
                <span className="text-xs font-extrabold text-brand-maroon bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                  From {formatINR(route.startingFare)}*
                </span>
              </div>

              {/* Destination Name Overlay */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h3 className="font-extrabold text-lg sm:text-xl leading-tight drop-shadow-sm">
                  {route.shortName}
                </h3>
              </div>
            </div>

            {/* 2. Route Metrics & Description */}
            <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal-700">
                  <span>{route.name}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                    {route.distanceKm} km
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                    {route.travelTime}
                  </span>
                </div>
              </div>

              {/* 3. Action Buttons: View Trip & WhatsApp Quick Plan */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={buildWhatsAppLink({
                    drop: route.shortName,
                    customMessage: `Hello Ramesh Shep, I would like to book a cab from Shirdi to ${route.shortName}.`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <Link
                  href={route.routeSlug}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-maroon-50 text-brand-maroon hover:bg-brand-maroon hover:text-white text-xs font-bold transition-colors"
                >
                  <span>View Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
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
