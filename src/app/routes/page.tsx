import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, Clock, ArrowRight, MessageSquare, Car, CheckCircle2 } from "lucide-react";
import { ROUTES_DATA } from "@/data/routesData";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink, formatINR } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = constructMetadata({
  title: "Outstation Taxi Routes From Shirdi | Cab Fares & Booking Guide",
  description:
    "Browse all outstation cab and taxi routes from Shirdi with Sai Shraddha Tours & Travels. Clean Ertiga & Tavera taxis to Nashik, Mumbai, Pune, Trimbakeshwar, and Aurangabad.",
  canonicalPath: "/routes",
});

export default function RoutesPage() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Hero */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-maroon" />
          <span>Direct Highway Cabs From Shirdi • Est. {BUSINESS_CONFIG.establishedYear}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
          Outstation Taxi Routes From Shirdi
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Planning an outstation cab journey from Shirdi? Choose from our verified routes across Maharashtra. Direct one-way drops, same-day return darshans, and multi-day packages in clean, air-conditioned Ertiga & Tavera vehicles.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppLink({
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about outstation taxi routes from Shirdi.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="md" variant="primary" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}>
              Get Instant WhatsApp Quote
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="md" variant="outline">
              Call Ramesh: {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </div>

      {/* 2. Routes Directory Grid - Image First */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              All 13 Major Highway Routes
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Select your route for vehicle options, driving times, and direct quotation requests.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-maroon hidden sm:inline">
            13 Verified Routes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROUTES_DATA.map((route) => {
            const dest = DESTINATIONS_DATA.find((d) => d.slug === route.destinationSlug);
            const imageUrl = dest?.imageUrl || route.imageUrl || "/images/destinations/fallback-destination.jpg";
            const imageAlt = dest?.imageAlt || route.imageAlt || route.destinationName;
            const startingFare = dest?.startingFare || route.startingFare;

            return (
              <div
                key={route.slug}
                id={route.slug}
                className="group rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:border-brand-maroon/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* 1. Landmark Photo with Badges */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                      {route.origin} → {route.destinationName}
                    </span>
                  </div>

                  {startingFare && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-extrabold text-brand-maroon bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                        From {formatINR(startingFare)}*
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-lg leading-tight drop-shadow-sm">
                      {route.destinationName}
                    </h3>
                  </div>
                </div>

                {/* 2. Route Metrics & Key Stops */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {/* Distance & Time pill */}
                    <div className="flex items-center gap-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                        {route.approxDistanceKmText}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                        {route.approxDurationText.split(" ")[0]} hrs
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {route.shortDescription}
                    </p>

                    {/* Key stops */}
                    <div className="space-y-1 pt-1">
                      {route.keyStopsAlongRoute.slice(0, 2).map((stop, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                          <span className="truncate">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <a
                      href={buildWhatsAppLink({
                        pickup: route.origin,
                        drop: route.destinationName,
                        customMessage: `Hello Ramesh Shep, I would like to enquire about a taxi from ${route.origin} to ${route.destinationName}.`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <Link
                      href={`/routes/${route.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-maroon-50 text-brand-maroon hover:bg-brand-maroon hover:text-white text-xs font-bold transition-colors"
                    >
                      <span>Route Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
