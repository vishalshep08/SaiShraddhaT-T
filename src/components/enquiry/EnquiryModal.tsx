"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";

export function EnquiryModal() {
  const { isOpen, contextData, closeEnquiryModal } = useEnquiryModal();

  // Escape key listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeEnquiryModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeEnquiryModal]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-enquiry-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={closeEnquiryModal}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeEnquiryModal}
          aria-label="Close enquiry dialog"
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-brand-charcoal-900 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-1">
          <EnquiryForm
            initialContext={contextData}
            isModal={true}
            className="border-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
