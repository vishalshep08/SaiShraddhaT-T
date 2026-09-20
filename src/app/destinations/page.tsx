import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, ArrowRight, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, formatINR } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "Destinations From Shirdi | Pilgrimage, Heritage & Outstation Travel",
  description:
    "Explore all destinations reachable from Shirdi with Sai Shraddha Tours & Travels. Pilgrimage shrines (Trimbakeshwar, Shani Shingnapur, Grishneshwar), caves, hill stations, and major cities.",
  canonicalPath: "/destinations",
});

export default function DestinationsPage() {
  const pilgrimageDests = DESTINATIONS_DATA.filter((d) => d.destinationType === "pilgrimage");
  const heritageAndCities = DESTINATIONS_DATA.filter(
    (d) => d.destinationType === "heritage" || d.destinationType === "city"
  );
  const hillStations = DESTINATIONS_DATA.filter((d) => d.destinationType === "hill_station");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header Hero */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-maroon" />
          <span>Local Travel Desk in Shirdi Since {BUSINESS_CONFIG.establishedYear}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
          Destinations & Travel Routes From Shirdi
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Plan your sacred darshan and Maharashtra journeys with ease. We provide clean, air-conditioned Ertiga, Tavera, Sedan, and Tempo Traveller cabs from Shirdi with experienced local drivers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link href="/routes">
            <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Taxi Routes & Fares
            </Button>
          </Link>

          <a
            href={buildWhatsAppLink({
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about travelling to a destination from Shirdi.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="md" variant="outline" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}>
              Custom Route on WhatsApp
            </Button>
          </a>
        </div>
      </div>

      {/* 2. Pilgrimage Destinations Section */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="saffron" size="sm">Spiritual Yatras</Badge>
              <h2 className="text-2xl font-bold text-brand-charcoal-900">
                Holy Pilgrimage Destinations
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Sacred Jyotirlingas, Shani Shingnapur, Shaktipeeths, and spiritual centers easily reachable from Shirdi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilgrimageDests.map((dest) => (
            <div
              key={dest.slug}
              id={dest.slug}
              className="group rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                <Image
                  src={dest.imageUrl || "/images/destinations/fallback-destination.jpg"}
                  alt={dest.imageAlt || dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {dest.district}
                  </span>
                </div>

                {dest.startingFare && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-extrabold text-brand-maroon bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                      From {formatINR(dest.startingFare)}*
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-lg leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                    <span>{dest.approxDistanceKmText}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {dest.shortDescription}
                  </p>

                  <div className="pt-1 space-y-1">
                    {dest.keyAttractions.slice(0, 2).map((attr, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                        <span className="truncate">{attr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
                  >
                    Guide →
                  </Link>

                  <Link
                    href={`/routes/${dest.routeSlug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-maroon-50 text-brand-maroon hover:bg-brand-maroon hover:text-white text-xs font-bold transition-colors"
                  >
                    <span>Taxi Options</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Heritage & Major Cities Section */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div className="border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="maroon" size="sm">Heritage & Transit</Badge>
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              Heritage Sites & Transit Cities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            UNESCO World Heritage caves, historical monuments, and expressway connections to Mumbai and Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heritageAndCities.map((dest) => (
            <div
              key={dest.slug}
              id={dest.slug}
              className="group rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                <Image
                  src={dest.imageUrl || "/images/destinations/fallback-destination.jpg"}
                  alt={dest.imageAlt || dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {dest.district}
                  </span>
                </div>

                {dest.startingFare && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-extrabold text-brand-maroon bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                      From {formatINR(dest.startingFare)}*
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-lg leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                    <span>{dest.approxDistanceKmText}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {dest.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
                  >
                    Guide →
                  </Link>

                  <Link
                    href={`/routes/${dest.routeSlug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-maroon-50 text-brand-maroon hover:bg-brand-maroon hover:text-white text-xs font-bold transition-colors"
                  >
                    <span>Taxi Options</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Hill Stations & Scenic Escapes */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div className="border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="gray" size="sm">Hill Stations</Badge>
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              Sahyadri Hill Stations & Scenic Escapes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Scenic Western Ghats getaways to combine with your family pilgrimage trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hillStations.map((dest) => (
            <div
              key={dest.slug}
              id={dest.slug}
              className="group rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                <Image
                  src={dest.imageUrl || "/images/destinations/fallback-destination.jpg"}
                  alt={dest.imageAlt || dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {dest.district}
                  </span>
                </div>

                {dest.startingFare && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-extrabold text-brand-maroon bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                      From {formatINR(dest.startingFare)}*
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-lg leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                    <span>{dest.approxDistanceKmText}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {dest.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
                  >
                    Guide →
                  </Link>

                  <Link
                    href={`/routes/${dest.routeSlug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-maroon-50 text-brand-maroon hover:bg-brand-maroon hover:text-white text-xs font-bold transition-colors"
                  >
                    <span>Shirdi to {dest.shortName} Cab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
