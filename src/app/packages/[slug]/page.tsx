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
  Clock,
  MapPin,
  Users,
  Compass,
} from "lucide-react";
import { TOUR_PACKAGES_DATA } from "@/data/packagesData";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";
import { ROUTES_DATA } from "@/data/routesData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { VehicleCategoryCard } from "@/components/fleet/VehicleCategoryCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InlineQuoteForm } from "@/components/enquiry/InlineQuoteForm";

interface PackagePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return TOUR_PACKAGES_DATA.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const pkg = TOUR_PACKAGES_DATA.find((p) => p.slug === params.slug);

  if (!pkg) {
    return constructMetadata({
      title: "Tour Package Not Found",
      description: "The requested pilgrimage tour package could not be found.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: pkg.seoTitle,
    description: pkg.seoDescription,
    canonicalPath: `/packages/${pkg.slug}`,
  });
}

export default function PackageDetailPage({ params }: PackagePageProps) {
  const pkg = TOUR_PACKAGES_DATA.find((p) => p.slug === params.slug);

  if (!pkg) {
    notFound();
  }

  const ramesh = BUSINESS_CONFIG.contacts[0];

  const recommendedVehicles = VEHICLE_CATEGORIES.filter((v) =>
    pkg.recommendedVehicleSlugs.includes(v.slug)
  );

  const relatedRoutes = ROUTES_DATA.filter((r) =>
    pkg.relatedRouteSlugs.includes(r.slug)
  );

  const otherPackages = TOUR_PACKAGES_DATA.filter((p) => p.slug !== pkg.slug);

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
        <Link href="/packages" className="hover:text-brand-maroon transition-colors">
          Tour Packages
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-brand-charcoal-900">{pkg.title}</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="saffron" size="sm">
            {pkg.packageType.replace("_", " ").toUpperCase()}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-maroon bg-brand-maroon-50 px-2.5 py-0.5 rounded border border-brand-maroon-100">
            <Clock className="w-3.5 h-3.5" />
            {pkg.durationText}
          </span>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            • Originating from Shirdi
          </span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
            {pkg.title}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            {pkg.shortDescription}
          </p>
        </div>

        {/* Destinations Covered Pill */}
        <div className="text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-1">
          <strong className="text-brand-charcoal-900 block">Destinations Included in this Yatra:</strong>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {pkg.destinationsCovered.map((dest, i) => (
              <span key={i} className="bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-700 font-medium">
                📍 {dest}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppLink({
              drop: pkg.title,
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about the ${pkg.title} from Shirdi. Please share itinerary options and quotation.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="primary"
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}
            >
              Plan This Tour on WhatsApp
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="lg" variant="outline" leftIcon={<Phone className="w-4 h-4 text-brand-maroon" />}>
              Call Ramesh: {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </section>

      {/* 3. Detailed Itinerary & Places Covered */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              Tour Overview
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {pkg.fullOverview}
            </p>
          </div>

          {/* Places Covered & Spiritual Significance */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <h3 className="text-xl font-bold text-brand-charcoal-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-maroon" />
              Holy Places & Sightseeing Covered in this Package
            </h3>

            <div className="space-y-3">
              {pkg.placesCoveredDetails.map((place, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-brand-charcoal-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{place.placeName}</span>
                  </div>
                  <p className="text-xs text-stone-600 pl-6 leading-relaxed">
                    {place.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customization Note */}
          <div className="bg-brand-ivory-200/90 rounded-xl p-6 border border-stone-300 space-y-2">
            <h4 className="text-base font-bold text-brand-charcoal-900">
              Flexible & Tailored to Your Family
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {pkg.customizationNotes} Speak with Ramesh Shep (Owner) to adjust pickup timings, add intermediate halts, or extend your tour by extra days.
            </p>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <ServiceFAQ faqs={pkg.faqs} title={`${pkg.title} FAQ`} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Suitable For */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-brand-charcoal-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-maroon" />
              Who is this tour best for?
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {pkg.suitableFor.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold bg-brand-ivory-200 text-brand-charcoal-900 px-3 py-1.5 rounded-md border border-brand-ivory-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Shirdi Desk Contact Box */}
          <div className="bg-brand-maroon text-white rounded-xl p-6 border border-brand-maroon-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-saffron-300" />
              <h4 className="font-bold text-base">Customise This Tour</h4>
            </div>
            <p className="text-xs text-brand-maroon-100 leading-relaxed">
              Speak directly with our Shirdi desk to get exact timings and a transparent quote for your family.
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
                drop: pkg.title,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-1"
            >
              <Button size="sm" variant="saffron" className="w-full text-xs font-bold">
                WhatsApp Fast Quote
              </Button>
            </a>
          </div>

          {/* Related Highway Routes */}
          {relatedRoutes.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Direct Cab Routes on this Tour
              </h4>
              <div className="space-y-2.5">
                {relatedRoutes.map((route) => (
                  <Link
                    key={route.slug}
                    href={`/routes/${route.slug}`}
                    className="block p-3 rounded-lg bg-stone-50 hover:bg-brand-maroon-50 border border-stone-200 hover:border-brand-maroon/30 transition-all group"
                  >
                    <div className="text-xs font-bold text-brand-charcoal-900 group-hover:text-brand-maroon">
                      {route.headline}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {route.approxDistanceKmText} • {route.approxDurationText}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Recommended Vehicles Section */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div>
          <Badge variant="maroon" size="sm" className="mb-1.5">Vehicle Fleet</Badge>
          <h2 className="text-2xl font-bold text-brand-charcoal-900">
            Recommended Vehicles for This Tour
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Choose from our directly owned Ertiga and Tavera fleet or on-demand group Tempo Travellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedVehicles.map((v) => (
            <VehicleCategoryCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* 5. Embedded Quote Form for this Package */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 max-w-4xl mx-auto">
        <div className="space-y-1 border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Shirdi Desk — Serving Since 2014</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight pt-2">
            Book This Tour — {pkg.title}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Tell us your travel date and group size. Ramesh Shep (Owner) will confirm availability and provide a clear, upfront quotation.
          </p>
        </div>

        <InlineQuoteForm
          embedded
          context={{
            enquiryType: "tour",
            requestIntent: "quote",
            sourcePage: `/packages/${pkg.slug}`,
            packageSlug: pkg.slug,
            packageName: pkg.title,
            origin: "Shirdi",
            destination: pkg.title,
            tripType: "multi_day",
          }}
          heading={`Quote for ${pkg.title}`}
          subtext="Your enquiry goes directly to our Sai Ashram desk."
          primaryPhone={ramesh.primaryPhone}
          primaryPhoneRaw={ramesh.primaryPhoneRaw}
        />
      </section>

      {/* 6. Explore Other Tour Packages */}
      <section className="space-y-4 pt-6 border-t border-stone-200">
        <h3 className="text-xl font-bold text-brand-charcoal-900">
          Other Pilgrimage Packages From Shirdi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherPackages.map((other) => (
            <Link
              key={other.slug}
              href={`/packages/${other.slug}`}
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-brand-maroon/50 hover:shadow-xs transition-all flex flex-col justify-between group space-y-2"
            >
              <div>
                <span className="text-[10px] font-bold text-brand-maroon uppercase tracking-wider block">
                  {other.durationText}
                </span>
                <h4 className="text-xs font-bold text-brand-charcoal-900 group-hover:text-brand-maroon transition-colors mt-0.5">
                  {other.title}
                </h4>
              </div>
              <span className="text-[11px] text-brand-maroon font-semibold pt-2 border-t border-stone-100">
                View Itinerary →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
