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
  Car,
} from "lucide-react";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";
import { TOUR_PACKAGES_DATA } from "@/data/packagesData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { VehicleCategoryCard } from "@/components/fleet/VehicleCategoryCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InlineQuoteForm } from "@/components/enquiry/InlineQuoteForm";

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return DESTINATIONS_DATA.map((dest) => ({
    slug: dest.slug,
  }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const dest = DESTINATIONS_DATA.find((d) => d.slug === params.slug);

  if (!dest) {
    return constructMetadata({
      title: "Destination Not Found",
      description: "The requested travel destination could not be found.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: dest.seoTitle,
    description: dest.seoDescription,
    canonicalPath: `/destinations/${dest.slug}`,
  });
}

export default function DestinationDetailPage({ params }: DestinationPageProps) {
  const dest = DESTINATIONS_DATA.find((d) => d.slug === params.slug);

  if (!dest) {
    notFound();
  }

  const ramesh = BUSINESS_CONFIG.contacts[0];

  const recommendedVehicles = VEHICLE_CATEGORIES.filter((v) =>
    dest.recommendedVehicleSlugs.includes(v.slug)
  );

  const relatedPackages = TOUR_PACKAGES_DATA.filter((p) =>
    dest.relatedPackageSlugs.includes(p.slug)
  );

  const otherDests = DESTINATIONS_DATA.filter((d) => d.slug !== dest.slug).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* 1. Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
      >
        <Link href="/" className="hover:text-brand-maroon transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link href="/destinations" className="hover:text-brand-maroon transition-colors">
          Destinations
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-brand-charcoal-900">{dest.name}</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="maroon" size="sm">
            {dest.destinationType.replace("_", " ").toUpperCase()}
          </Badge>
          <span className="text-xs text-stone-500 font-medium">
            • {dest.district}, {dest.state}
          </span>
          <span className="text-xs text-stone-400 hidden sm:inline">•</span>
          <span className="text-xs text-brand-maroon font-semibold hidden sm:inline">
            Direct Cabs from Shirdi
          </span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
            {dest.name} Travel From Shirdi
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            {dest.shortDescription}
          </p>
        </div>

        {/* Quick Route Context Pill */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
          <div className="flex items-center gap-1.5 font-semibold">
            <MapPin className="w-4 h-4 text-brand-maroon shrink-0" />
            <span>{dest.approxDistanceKmText}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 font-semibold">
            <Clock className="w-4 h-4 text-brand-maroon shrink-0" />
            <span>{dest.approxDurationText}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link href={`/routes/${dest.routeSlug}`}>
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Shirdi to {dest.shortName} Cab Options
            </Button>
          </Link>

          <a
            href={buildWhatsAppLink({
              drop: dest.name,
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about visiting ${dest.name} from Shirdi.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-600 text-emerald-800 hover:bg-emerald-50"
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
            >
              Enquire on WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* 3. Detailed Overview & Why Visit */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              About {dest.name}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {dest.fullOverview}
            </p>

            <div className="pt-4 border-t border-stone-100 space-y-2">
              <h3 className="text-base font-bold text-brand-charcoal-900">
                Why Shirdi Devotees & Travellers Visit {dest.shortName}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {dest.whyVisitFromShirdi}
              </p>
            </div>
          </div>

          {/* Key Attractions */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-brand-charcoal-900">
              Important Places & Holy Attractions in {dest.shortName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {dest.keyAttractions.map((attr, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-maroon shrink-0 mt-0.5" />
                  <span>{attr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Route Bridge Card */}
          <div className="bg-brand-ivory-200/90 rounded-xl p-6 sm:p-8 border border-stone-300 space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">
                Direct Taxi Service Available
              </span>
              <h4 className="text-xl font-bold text-brand-charcoal-900 mt-0.5">
                Shirdi to {dest.name} Private Cab
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                One-way drops, same-day return darshan, and multi-day packages in clean Ertiga and Tavera cabs.
              </p>
            </div>

            <Link href={`/routes/${dest.routeSlug}`} className="shrink-0">
              <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Check Route Details & Fares
              </Button>
            </Link>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <ServiceFAQ faqs={dest.faqs} title={`${dest.name} Travel FAQ`} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Related Tour Packages */}
          {relatedPackages.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-brand-charcoal-900 border-b border-stone-100 pb-2">
                Pilgrimage Tour Packages
              </h3>
              <div className="space-y-3">
                {relatedPackages.map((pkg) => (
                  <Link
                    key={pkg.slug}
                    href={`/packages/${pkg.slug}`}
                    className="block p-3.5 rounded-lg bg-stone-50 hover:bg-brand-maroon-50 border border-stone-200 hover:border-brand-maroon/30 transition-all group"
                  >
                    <div className="text-xs font-bold text-brand-charcoal-900 group-hover:text-brand-maroon transition-colors">
                      {pkg.title}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      ⏱ {pkg.durationText}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Direct Shirdi Desk Contact Box */}
          <div className="bg-brand-maroon text-white rounded-xl p-6 border border-brand-maroon-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-saffron-300" />
              <h4 className="font-bold text-base">Book Cab From Shirdi</h4>
            </div>
            <p className="text-xs text-brand-maroon-100 leading-relaxed">
              Get an instant, transparent quote for {dest.name} directly from Ramesh Shep (Owner) at our Sai Ashram desk.
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
                drop: dest.name,
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

      {/* 4. Recommended Vehicles Section */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div>
          <Badge variant="maroon" size="sm" className="mb-1.5">Vehicle Fleet</Badge>
          <h2 className="text-2xl font-bold text-brand-charcoal-900">
            Recommended Vehicles for Travelling to {dest.shortName}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Choose from our directly owned Ertiga and Tavera fleet or on-demand group vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedVehicles.map((v) => (
            <VehicleCategoryCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* 5. Embedded Quote Form */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 max-w-4xl mx-auto">
        <div className="space-y-1 border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Shirdi Desk — Open 24/7</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight pt-2">
            Book a Cab to {dest.shortName} from Shirdi
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Share your journey details. Ramesh Shep (Owner) will confirm vehicle availability and fare directly.
          </p>
        </div>

        <InlineQuoteForm
          embedded
          context={{
            enquiryType: "destination",
            requestIntent: "quote",
            sourcePage: `/destinations/${dest.slug}`,
            destinationSlug: dest.slug,
            origin: "Shirdi",
            destination: dest.name,
          }}
          heading={`Quote — Shirdi to ${dest.shortName}`}
          subtext="Your enquiry goes directly to our Sai Ashram desk."
          primaryPhone={ramesh.primaryPhone}
          primaryPhoneRaw={ramesh.primaryPhoneRaw}
        />
      </section>

      {/* 6. Explore Other Destinations */}
      <section className="space-y-4 pt-6 border-t border-stone-200">
        <h3 className="text-xl font-bold text-brand-charcoal-900">
          Other Destinations Reachable From Shirdi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherDests.map((other) => (
            <Link
              key={other.slug}
              href={`/destinations/${other.slug}`}
              className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-brand-maroon/50 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-brand-charcoal-900 group-hover:text-brand-maroon transition-colors block">
                  {other.name}
                </span>
                <span className="text-[11px] text-stone-400">{other.approxDistanceKmText}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-brand-maroon transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
