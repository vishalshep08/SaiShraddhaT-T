"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Phone, X } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { EnquiryContextData } from "@/types/enquiry";
import { Button } from "@/components/ui/Button";
import { buildPhoneLink } from "@/lib/utils";

interface InlineQuoteFormProps {
  context: EnquiryContextData;
  triggerLabel?: string;
  heading?: string;
  subtext?: string;
  /** If true, renders as a always-visible embedded section (not a modal trigger) */
  embedded?: boolean;
  /** Primary phone for fallback dialer */
  primaryPhone?: string;
  primaryPhoneRaw?: string;
}

/**
 * Renders either:
 * - An inline embedded quote form (embedded=true), for bottom-of-page conversion sections
 * - A "Get a Quote" trigger button that expands an inline form panel
 */
export function InlineQuoteForm({
  context,
  triggerLabel = "Get a Free Quote",
  heading = "Request a Journey Quote",
  subtext = "Tell us your travel plan. Ramesh Shep (Owner) will confirm availability and fare.",
  embedded = false,
  primaryPhone,
  primaryPhoneRaw,
}: InlineQuoteFormProps) {
  const [isOpen, setIsOpen] = useState(embedded);

  if (!isOpen) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-maroon text-white text-sm font-bold hover:bg-brand-maroon-800 transition-colors shadow-sm"
        >
          <ArrowRight className="w-4 h-4 text-brand-saffron" />
          {triggerLabel}
        </button>

        {primaryPhoneRaw && primaryPhone && (
          <a
            href={buildPhoneLink(primaryPhoneRaw)}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-brand-charcoal-900 text-white text-sm font-bold hover:bg-brand-charcoal-800 transition-colors"
          >
            <Phone className="w-4 h-4 text-brand-saffron" />
            Call: {primaryPhone}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {!embedded && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-brand-charcoal-900">{heading}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{subtext}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-brand-maroon hover:bg-stone-100 transition-colors"
            aria-label="Close quote form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <EnquiryForm initialContext={context} />
    </div>
  );
}
