"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare, Calendar } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";

export function MobileStickyBar() {
  const pathname = usePathname();
  const ramesh = BUSINESS_CONFIG.contacts[0];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-3 py-2">
      <div className="grid grid-cols-3 gap-2">
        {/* Direct Call to Owner Ramesh Shep */}
        <a
          href={buildPhoneLink(ramesh.primaryPhoneRaw)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md bg-stone-100 text-brand-charcoal-900 border border-stone-300 text-xs font-semibold hover:bg-stone-200 active:scale-95 transition-all text-center"
        >
          <Phone className="w-4 h-4 text-brand-maroon shrink-0" />
          <span>Call Owner</span>
        </a>

        {/* WhatsApp Direct */}
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all text-center shadow-xs"
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Get a Quote */}
        <a
          href="/#quick-enquiry"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md bg-brand-maroon text-white text-xs font-semibold hover:bg-brand-maroon-800 active:scale-95 transition-all text-center shadow-xs"
        >
          <Calendar className="w-4 h-4 text-brand-saffron-300 shrink-0" />
          <span>Get Quote</span>
        </a>
      </div>
    </div>
  );
}
