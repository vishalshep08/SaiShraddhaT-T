import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, ArrowRight, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "Destinations From Shirdi | Pilgrimage, Heritage & Outstation Travel",
  description: "Explore all destinations reachable from Shirdi with Sai Shraddha Tours & Travels. Pilgrimage shrines (Trimbakeshwar, Shani Shingnapur, Grishneshwar), caves, hill stations, and major cities.",
  canonicalPath: "/destinations",
});

export default function DestinationsPage() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

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
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-brand-charcoal-900 leading-snug">
                    {dest.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-brand-maroon bg-brand-maroon-50 px-2 py-0.5 rounded shrink-0">
                    {dest.district}
                  </span>
                </div>

                <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{dest.approxDistanceKmText}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {dest.shortDescription}
                </p>

                <div className="pt-2 space-y-1">
                  {dest.keyAttractions.slice(0, 3).map((attr, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-3 h-3 text-brand-maroon shrink-0" />
                      <span className="truncate">{attr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="text-xs font-semibold text-brand-charcoal-900 hover:text-brand-maroon transition-colors"
                >
                  Destination Guide →
                </Link>

                <Link
                  href={`/routes/${dest.routeSlug}`}
                  className="text-xs font-bold text-brand-maroon hover:underline"
                >
                  Taxi from Shirdi →
                </Link>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {heritageAndCities.map((dest) => (
            <div
              key={dest.slug}
              className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-base text-brand-charcoal-900">
                  {dest.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {dest.approxDistanceKmText}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {dest.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <Link href={`/destinations/${dest.slug}`} className="text-stone-600 hover:text-brand-maroon font-medium">
                  Details
                </Link>
                <Link href={`/routes/${dest.routeSlug}`} className="text-brand-maroon font-bold hover:underline">
                  Book Cab →
                </Link>
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
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-brand-maroon/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-brand-charcoal-900">
                    {dest.name}
                  </h3>
                  <span className="text-xs text-stone-500">{dest.approxDistanceKmText}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {dest.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <Link href={`/destinations/${dest.slug}`} className="text-xs font-semibold text-brand-charcoal-900 hover:text-brand-maroon">
                  Explore {dest.shortName} →
                </Link>
                <Link href={`/routes/${dest.routeSlug}`}>
                  <Button size="sm" variant="primary" className="text-xs">
                    Shirdi to {dest.shortName} Cab
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
