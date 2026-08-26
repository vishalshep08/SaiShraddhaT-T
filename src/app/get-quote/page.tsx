import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Car,
  Clock,
} from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { EnquiryContextData, RequestIntent } from "@/types/enquiry";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = constructMetadata({
  title: "Get a Taxi Quote & Cab Booking in Shirdi | Sai Shraddha Tours & Travels",
  description:
    "Request an exact quote for outstation cabs, Shirdi sightseeing, airport drops, and pilgrimage tours. Prompt quotes from our Sai Ashram desk since 2014.",
  canonicalPath: "/get-quote",
});

interface GetQuotePageProps {
  searchParams: {
    route?: string;
    destination?: string;
    service?: string;
    package?: string;
    vehicle?: string;
    intent?: string;
    from?: string;
    to?: string;
  };
}

export default function GetQuotePage({ searchParams }: GetQuotePageProps) {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  const initialContext: EnquiryContextData = {
    origin: searchParams.from || "Shirdi",
    destination: searchParams.to || searchParams.destination || searchParams.route?.replace("shirdi-to-", "") || "",
    routeSlug: searchParams.route,
    destinationSlug: searchParams.destination,
    serviceSlug: searchParams.service,
    packageSlug: searchParams.package,
    vehicleCategorySlug: searchParams.vehicle,
    requestIntent:
      searchParams.intent === "booking" ? "booking_request" : "quote",
    sourcePage: "/get-quote",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
      >
        <Link href="/" className="hover:text-brand-maroon transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-brand-charcoal-900">Get a Quote</span>
      </nav>

      {/* 2. Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-maroon" />
          <span>Direct Travel Desk in Shirdi Since {BUSINESS_CONFIG.establishedYear}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal-900 tracking-tight leading-tight">
          Request a Journey Quotation
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Planning a pilgrimage, outstation highway journey, airport transfer, or local Shirdi sightseeing? Tell us your travel plan below for a clear, honest quote with zero hidden charges.
        </p>
      </div>

      {/* 3. Form Grid + Trust Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-8">
          <EnquiryForm initialContext={initialContext} />
        </div>

        {/* Sidebar Reassurance & Contacts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Direct Call / WhatsApp Box */}
          <div className="bg-brand-maroon text-white rounded-2xl p-6 sm:p-7 border border-brand-maroon-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-saffron-300" />
              <h3 className="font-bold text-lg">Need Immediate Assistance?</h3>
            </div>
            <p className="text-xs text-brand-maroon-100 leading-relaxed">
              Prefer speaking with the owner directly? Call Ramesh Shep now. Available 24/7 for urgent departures and morning temple darshans.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a
                href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                className="flex items-center justify-between p-3 rounded-xl bg-brand-maroon-800/80 border border-brand-maroon-700 hover:bg-brand-maroon-800 transition-colors"
              >
                <span>Call Ramesh Shep (Owner):</span>
                <span className="font-bold font-mono text-brand-saffron-200">{ramesh.primaryPhone}</span>
              </a>
            </div>

            <a
              href={buildWhatsAppLink({
                customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about taxi travel from Shirdi.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-1"
            >
              <Button size="md" variant="saffron" className="w-full text-xs font-bold">
                WhatsApp Direct Desk
              </Button>
            </a>
          </div>

          {/* Why Book With Sai Shraddha */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-brand-charcoal-900 border-b border-stone-100 pb-2">
              Why Devotees Choose Us
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-charcoal-900 block">Serving Since 2014</strong>
                  Over a decade of genuine offline taxi service in Shirdi.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-charcoal-900 block">Owned Clean Fleet</strong>
                  Directly maintained 3 × Maruti Ertiga and 1 × Tavera cabs.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-charcoal-900 block">No Hidden Charges</strong>
                  All toll and tax terms discussed transparently upfront.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-charcoal-900 block">Sai Ashram Desk</strong>
                  Physical office at Sai Ashram (Bhakta Niwas 1000 Rooms).
                </div>
              </div>
            </div>
          </div>

          {/* Office Address */}
          <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-bold text-brand-charcoal-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-maroon" />
              <span>Office Location in Shirdi</span>
            </div>
            <p>{BUSINESS_CONFIG.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
