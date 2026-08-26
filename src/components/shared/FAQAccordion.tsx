"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQItem } from "@/types/trust";

interface FAQAccordionProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQAccordion({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Clear, straightforward answers about our Shirdi cab services, pilgrimage routes, and booking process.",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="max-w-3xl mx-auto divide-y divide-stone-200/80 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.id || idx} className="transition-colors">
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
              >
                <span className="font-bold text-sm sm:text-base text-brand-charcoal-900 leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-brand-maroon" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2 border-t border-stone-100 bg-stone-50/40">
                  <p className="whitespace-pre-wrap">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
