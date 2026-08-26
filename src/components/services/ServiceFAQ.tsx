"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { ServiceFAQ as ServiceFAQType } from "@/types/services";

interface ServiceFAQProps {
  faqs: ServiceFAQType[];
  title?: string;
}

export function ServiceFAQ({ faqs, title = "Frequently Asked Questions" }: ServiceFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-brand-maroon" />
        <h3 className="text-xl font-bold text-brand-charcoal-900">{title}</h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-bold text-sm sm:text-base text-brand-charcoal-900">
                  {faq.question}
                </span>
                <span className="p-1 rounded-md bg-stone-100 text-stone-600 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
