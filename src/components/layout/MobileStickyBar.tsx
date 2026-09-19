"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, Calendar } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/utils";
import { useEnquiryModal } from "@/context/EnquiryModalContext";

export function MobileStickyBar() {
  const pathname = usePathname();
  const { openEnquiryModal } = useEnquiryModal();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
        {/* WhatsApp Ramesh */}
        <a
          href={buildWhatsAppLink({
            customMessage: `Hello Ramesh Shep, I would like to enquire about a taxi from Shirdi.`,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all text-center shadow-xs"
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Get a Quote Modal Trigger */}
        <button
          type="button"
          onClick={() =>
            openEnquiryModal({
              origin: "Shirdi",
              sourcePage: "mobile_sticky_bar",
            })
          }
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-800 active:scale-95 transition-all text-center shadow-xs"
        >
          <Calendar className="w-4 h-4 text-brand-saffron-300 shrink-0" />
          <span>Get Quote</span>
        </button>
      </div>
    </div>
  );
}
