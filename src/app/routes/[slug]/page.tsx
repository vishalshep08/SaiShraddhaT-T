import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Clock,
  Navigation,
  Car,
  Users,
} from "lucide-react";
import { ROUTES_DATA } from "@/data/routesData";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { SERVICES_DATA } from "@/data/servicesData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InlineQuoteForm } from "@/components/enquiry/InlineQuoteForm";

interface RoutePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return ROUTES_DATA.map((route) => ({
    slug: route.slug,
  }));
}

export async function generateMetadata({
  params,
}: RoutePageProps): Promise<Metadata> {
  const route = ROUTES_DATA.find((r) => r.slug === params.slug);

  if (!route) {
    return constructMetadata({
      title: "Route Not Found",
      description: "The requested travel route could not be found.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: route.seoTitle,
    description: route.seoDescription,
    canonicalPath: `/routes/${route.slug}`,
  });
}

export default function RouteDetailPage({ params }: RoutePageProps) {
  const route = ROUTES_DATA.find((r) => r.slug === params.slug);

  if (!route) {
    notFound();
  }

  const ramesh = BUSINESS_CONFIG.contacts[0];

  // Destination context
  const destination = DESTINATIONS_DATA.find((d) => d.slug === route.destinationSlug);

  // Related routes
  const relatedRoutes = ROUTES_DATA.filter((r) => route.relatedRouteSlugs.includes(r.slug));

  // Related services
  const relatedServices = SERVICES_DATA.filter((s) => route.relatedServiceSlugs.includes(s.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* 1. Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
      >
        <Link href="/" className="hover:text-brand-maroon transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link href="/routes" className="hover:text-brand-maroon transition-colors">
          Taxi Routes
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-brand-charcoal-900">{route.origin} to {route.destinationName} Taxi</span>
      </nav>

      {/* 2. Route Hero Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="maroon" size="sm">
            {route.origin} → {route.destinationName}
          </Badge>
          <span className="text-xs text-stone-500 font-medium">
            • {route.approxDistanceKmText} • Approx. {route.approxDurationText}
          </span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
            {route.headline}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            {route.shortDescription}
          </p>
        </div>

        {/* Route Details Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Distance</span>
            <div className="flex items-center gap-1.5 font-bold text-brand-charcoal-900">
              <MapPin className="w-4 h-4 text-brand-maroon shrink-0" />
              <span>{route.approxDistanceKmText}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Approx. Driving Time</span>
            <div className="flex items-center gap-1.5 font-bold text-brand-charcoal-900">
              <Clock className="w-4 h-4 text-brand-maroon shrink-0" />
              <span>{route.approxDurationText}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Highway Route</span>
            <div className="flex items-center gap-1.5 font-bold text-brand-charcoal-900">
              <Navigation className="w-4 h-4 text-brand-maroon shrink-0" />
              <span className="truncate">{route.highwayRoute}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppLink({
              pickup: route.origin,
              drop: route.destinationName,
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about a taxi from ${route.origin} to ${route.destinationName}. Please share vehicle availability and quotation.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="primary"
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}
            >
              Get Quote on WhatsApp
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="lg" variant="outline" leftIcon={<Phone className="w-4 h-4 text-brand-maroon" />}>
              Call Ramesh Shep (Owner): {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </section>

      {/* 3. Detailed Route Information */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              About the {route.origin} to {route.destinationName} Cab Journey
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {route.routeOverview}
            </p>

            {/* Trip Types Supported */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal-900">
                Trip Options Available
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {route.tripTypesAvailable.map((type, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-brand-maroon-50 text-brand-maroon border border-brand-maroon-200 px-3 py-1.5 rounded-md"
                  >
                    ✓ {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Stops & Attractions along the route */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-brand-charcoal-900">
              Popular Stops & Sightseeing on This Route
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {route.keyStopsAlongRoute.map((stop, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-maroon shrink-0 mt-0.5" />
                  <span>{stop}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Recommendation Matrix for this Route */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <div>
              <Badge variant="maroon" size="sm" className="mb-1.5">Vehicle Recommendation</Badge>
              <h3 className="text-xl font-bold text-brand-charcoal-900">
                Recommended Vehicle by Group Size
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Choose the best suited seating capacity for your family on the {route.destinationName} route.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {route.recommendedVehicles.map((rv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2 hover:border-brand-maroon/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-maroon uppercase tracking-wider block">
                      {rv.groupSizeText}
                    </span>
                    <h4 className="font-bold text-sm text-brand-charcoal-900">
                      {rv.vehicleName}
                    </h4>
                    <p className="text-xs text-stone-600">
                      {rv.capacityText}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/80">
                    <a
                      href={buildWhatsAppLink({
                        pickup: route.origin,
                        drop: route.destinationName,
                        vehicle: rv.vehicleName,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Enquire for this Vehicle →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <ServiceFAQ faqs={route.faqs} title={`${route.destinationName} Taxi FAQ`} />
          </div>
        </div>

        {/* Sidebar: Direct Contact + Destination Bridge */}
        <div className="lg:col-span-4 space-y-6">
          {/* Destination Bridge Link */}
          {destination && (
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider text-stone-500">
                Destination Information
              </h4>
              <h3 className="text-lg font-bold text-brand-charcoal-900">
                Explore {destination.name}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {destination.shortDescription}
              </p>
              <div className="pt-2">
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1"
                >
                  View Full {destination.name} Guide →
                </Link>
              </div>
            </div>
          )}

          {/* Direct Shirdi Desk Contact Box */}
          <div className="bg-brand-maroon text-white rounded-xl p-6 border border-brand-maroon-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-saffron-300" />
              <h4 className="font-bold text-base">Direct Shirdi Cab Desk</h4>
            </div>
            <p className="text-xs text-brand-maroon-100 leading-relaxed">
              Get an exact upfront quote for <strong>{route.origin} to {route.destinationName}</strong> with zero surge charges.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <a
                href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-brand-maroon-800/80 border border-brand-maroon-700 hover:bg-brand-maroon-800"
              >
                <span>Call Ramesh Shep (Owner):</span>
                <span className="font-bold font-mono text-brand-saffron-200">{ramesh.primaryPhone}</span>
              </a>
            </div>

            <a
              href={buildWhatsAppLink({
                pickup: route.origin,
                drop: route.destinationName,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-1"
            >
              <Button size="sm" variant="saffron" className="w-full text-xs font-bold">
                WhatsApp Direct Quote
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Related Routes Internal Links */}
      {relatedRoutes.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-stone-200">
          <h3 className="text-xl font-bold text-brand-charcoal-900">
            Other Popular Routes From Shirdi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedRoutes.map((rel) => (
              <Link
                key={rel.slug}
                href={`/routes/${rel.slug}`}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-brand-maroon/50 hover:shadow-xs transition-all flex flex-col justify-between group space-y-2"
              >
                <div>
                  <span className="text-[11px] font-bold text-brand-maroon uppercase">
                    Shirdi → {rel.destinationName}
                  </span>
                  <h4 className="text-xs font-bold text-brand-charcoal-900 group-hover:text-brand-maroon transition-colors mt-0.5">
                    {rel.headline}
                  </h4>
                </div>
                <div className="text-[11px] text-stone-500 flex items-center justify-between pt-2 border-t border-stone-100">
                  <span>{rel.approxDistanceKmText}</span>
                  <span className="text-brand-maroon font-semibold">View Route →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Final CTA — Embedded Quote Form */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 max-w-4xl mx-auto">
        <div className="space-y-1 border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Shirdi Booking Desk — Serving Since 2014</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight pt-2">
            Request a Quote for {route.origin} → {route.destinationName}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Share your travel date and passenger count. Ramesh Shep (Owner) will confirm your vehicle availability and fare promptly.
          </p>
        </div>

        <InlineQuoteForm
          embedded
          context={{
            enquiryType: "route",
            requestIntent: "quote",
            sourcePage: `/routes/${route.slug}`,
            routeSlug: route.slug,
            origin: route.origin,
            destination: route.destinationName,
            destinationSlug: route.destinationSlug,
          }}
          heading={`Quote for ${route.origin} → ${route.destinationName}`}
          subtext="Your details go directly to our Shirdi desk — no middleman."
          primaryPhone={ramesh.primaryPhone}
          primaryPhoneRaw={ramesh.primaryPhoneRaw}
        />
      </section>
    </div>
  );
}
