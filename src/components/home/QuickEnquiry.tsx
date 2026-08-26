"use client";

import React from "react";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";

export function QuickEnquiry() {
  return (
    <section id="quick-enquiry" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <EnquiryForm
        initialContext={{
          origin: "Shirdi",
          sourcePage: "homepage_quick_enquiry",
        }}
      />
    </section>
  );
}
