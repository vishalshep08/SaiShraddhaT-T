import React from "react";
import { Metadata } from "next";
import { Phone, MessageSquare, MapPin, Clock, ShieldCheck } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { InlineQuoteForm } from "@/components/enquiry/InlineQuoteForm";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us — Sai Shraddha Tours & Travels, Shirdi (Est. 2014)",
  description:
    "Contact Sai Shraddha Tours & Travels in Shirdi. Call Ramesh Shep (Owner) directly, chat on WhatsApp, or send your travel requirement. Sai Ashram desk open 24/7.",
  canonicalPath: "/contact",
});

export default function ContactPage() {
  const ramesh = BUSINESS_CONFIG.contacts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="maroon">Get In Touch</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal-900 tracking-tight">
          Contact {BUSINESS_CONFIG.name}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Based at Sai Ashram (Bhakta Niwas 1000 Rooms), Shirdi, we have been helping pilgrims and travelers since 2014. Contact Ramesh Shep directly on call, WhatsApp, or send your journey details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left — Contact Info */}
        <div className="lg:col-span-5 space-y-5">
          {/* Call Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-brand-charcoal-900 text-white space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-charcoal-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-brand-saffron" />
              <h2 className="text-base font-bold">Call or WhatsApp Directly</h2>
            </div>

            <div className="space-y-4 text-sm">
              {/* Ramesh Shep — Owner */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Ramesh Shep — Owner
                </span>
                <div className="flex flex-col gap-1.5">
                  <a
                    href={buildPhoneLink(ramesh.primaryPhoneRaw)}
                    className="flex items-center justify-between p-3 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 transition-colors"
                  >
                    <span className="text-stone-400 text-xs">Direct Call</span>
                    <span className="font-bold font-mono text-brand-saffron">{ramesh.primaryPhone}</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={buildWhatsAppLink({
                  customMessage: `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about taxi/cab service from Shirdi.`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-200" />
                  <span className="font-bold text-sm">WhatsApp Chat</span>
                </div>
                <span className="font-mono text-emerald-200 text-sm">{BUSINESS_CONFIG.whatsapp}</span>
              </a>
            </div>
          </div>

          {/* Address & Hours */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-maroon-50 text-brand-maroon flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-brand-charcoal-900 mb-0.5">Booking Desk Location</strong>
                <span className="text-stone-600 leading-relaxed">{BUSINESS_CONFIG.address}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-brand-charcoal-900 mb-0.5">Operating Hours</strong>
                <span className="text-stone-600">24 Hours, 7 Days a Week</span>
                <p className="text-xs text-stone-500 mt-0.5">
                  Available for Kakad Aarti pickups, airport transfers, and early morning departures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="border-b border-stone-100 pb-4 space-y-1">
              <h2 className="text-xl font-extrabold text-brand-charcoal-900">
                Send Your Journey Requirement
              </h2>
              <p className="text-xs text-stone-500">
                Ramesh Shep (Owner) will contact you to discuss vehicle availability and fares.
              </p>
            </div>
            <InlineQuoteForm
              embedded
              context={{
                enquiryType: "general",
                requestIntent: "quote",
                sourcePage: "/contact",
                origin: "Shirdi",
              }}
              heading="Journey Enquiry"
              subtext="Your message goes directly to our Shirdi desk."
              primaryPhone={ramesh.primaryPhone}
              primaryPhoneRaw={ramesh.primaryPhoneRaw}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
