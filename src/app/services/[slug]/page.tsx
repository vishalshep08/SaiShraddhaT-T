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
  Users,
  Car,
} from "lucide-react";
import { SERVICES_DATA } from "@/data/servicesData";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceHowItWorks } from "@/components/services/ServiceHowItWorks";
import { VehicleCategoryCard } from "@/components/fleet/VehicleCategoryCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InlineQuoteForm } from "@/components/enquiry/InlineQuoteForm";

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const service = SERVICES_DATA.find((s) => s.slug === params.slug);

  if (!service) {
    return constructMetadata({
      title: "Service Not Found",
      description: "The requested travel service could not be found.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    canonicalPath: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = SERVICES_DATA.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const ramesh = BUSINESS_CONFIG.contacts[0];

  // Resolve recommended vehicle categories
  const recommendedVehicles = VEHICLE_CATEGORIES.filter((v) =>
    service.recommendedVehicleCategorySlugs.includes(v.slug)
  );

  // Other services for internal linking
  const otherServices = SERVICES_DATA.filter((s) => s.slug !== service.slug);

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
        <Link href="/services" className="hover:text-brand-maroon transition-colors">
          Services
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-brand-charcoal-900">{service.title}</span>
      </nav>

      {/* 2. Service Hero Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="maroon" size="sm">
            {service.category.toUpperCase()} TRAVEL
          </Badge>
          <span className="text-xs text-stone-500 font-medium">
            • Serving Shirdi Since {BUSINESS_CONFIG.establishedYear}
          </span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Hero Actions */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={buildWhatsAppLink({
              drop: service.title,
              customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about ${service.title} from Shirdi. Please share vehicle availability and quotation.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="primary"
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-300" />}
            >
              Enquire on WhatsApp
            </Button>
          </a>

          <a href={buildPhoneLink(ramesh.primaryPhoneRaw)}>
            <Button size="lg" variant="outline" leftIcon={<Phone className="w-4 h-4 text-brand-maroon" />}>
              Call Ramesh Shep (Owner): {ramesh.primaryPhone}
            </Button>
          </a>
        </div>
      </section>

      {/* 3. Detailed Overview & Suitable For */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              Service Overview
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {service.fullOverview}
            </p>

            {/* Key Highlights */}
            <div className="pt-4 border-t border-stone-100 space-y-2.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal-900">
                Key Service Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {service.keyHighlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-maroon shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How it Works Component */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <ServiceHowItWorks steps={service.howItWorks} />
          </div>

          {/* Coverage / Popular Route Stops */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-brand-charcoal-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-maroon" />
              Destinations & Stops Covered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {service.coverageAreas.map((area, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <span className="text-brand-maroon font-bold">•</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service FAQ Component */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <ServiceFAQ faqs={service.faqs} />
          </div>
        </div>

        {/* Sidebar: Suitable For + Direct Contact Box */}
        <div className="lg:col-span-4 space-y-6">
          {/* Suitable For */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-brand-charcoal-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-maroon" />
              Who is this service best for?
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {service.suitableFor.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold bg-brand-ivory-200 text-brand-charcoal-900 px-3 py-1.5 rounded-md border border-brand-ivory-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Shirdi Desk Box */}
          <div className="bg-brand-maroon text-white rounded-xl p-6 border border-brand-maroon-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-saffron-300" />
              <h4 className="font-bold text-base">Direct Shirdi Desk</h4>
            </div>
            <p className="text-xs text-brand-maroon-100 leading-relaxed">
              Speak directly with Ramesh Shep (Owner) to customize your route or check vehicle availability for today/tomorrow.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <a
                href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-brand-maroon-800/80 border border-brand-maroon-700 hover:bg-brand-maroon-800 transition-colors"
              >
                <span>Call Ramesh Shep (Owner):</span>
                <span className="font-bold font-mono text-brand-saffron-200">{ramesh.primaryPhone}</span>
              </a>
            </div>

            <a
              href={buildWhatsAppLink({
                drop: service.title,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-2"
            >
              <Button size="sm" variant="saffron" className="w-full text-xs font-bold">
                WhatsApp Fast Quote
              </Button>
            </a>
          </div>

          {/* Office Address */}
          <div className="p-5 rounded-xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-bold text-brand-charcoal-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-maroon" />
              <span>Office Location</span>
            </div>
            <p>{BUSINESS_CONFIG.address}</p>
          </div>
        </div>
      </section>

      {/* 4. Recommended Vehicles Section */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="maroon" size="sm" className="mb-1.5">Recommended Fleet</Badge>
            <h2 className="text-2xl font-bold text-brand-charcoal-900">
              Vehicle Options for {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select the most comfortable capacity for your family or group size.
            </p>
          </div>
          <Link href="/fleet" className="text-xs font-semibold text-brand-maroon hover:underline hidden sm:inline">
            View All Vehicles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedVehicles.map((vehicle) => (
            <VehicleCategoryCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* 5. Internal Links: Explore Other Services */}
      <section className="space-y-4 pt-8 border-t border-stone-200">
        <h3 className="text-xl font-bold text-brand-charcoal-900">
          Explore Other Travel Services in Shirdi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherServices.map((other) => (
            <Link
              key={other.slug}
              href={`/services/${other.slug}`}
              className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-brand-maroon/50 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <span className="text-xs font-bold text-brand-charcoal-900 group-hover:text-brand-maroon transition-colors">
                {other.title}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-brand-maroon transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Final Conversion — Embedded Quote Form */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 max-w-4xl mx-auto">
        <div className="space-y-1 border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direct Shirdi Booking Desk — Serving Since 2014</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight pt-2">
            Request a Quote for {service.title}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Share your journey details and passenger count. Ramesh Shep (Owner) will confirm the fare and vehicle promptly.
          </p>
        </div>

        <InlineQuoteForm
          embedded
          context={{
            enquiryType: "service",
            requestIntent: "quote",
            sourcePage: `/services/${service.slug}`,
            serviceSlug: service.slug,
            serviceName: service.title,
            origin: "Shirdi",
          }}
          heading={`Quote for ${service.title}`}
          subtext="Your enquiry goes directly to our Sai Ashram desk."
          primaryPhone={ramesh.primaryPhone}
          primaryPhoneRaw={ramesh.primaryPhoneRaw}
        />
      </section>
    </div>
  );
}
