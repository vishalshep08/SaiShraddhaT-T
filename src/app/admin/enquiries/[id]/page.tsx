import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getEnquiryDetailAction } from "@/actions/adminEnquiryActions";
import { EnquiryDetailManager } from "@/components/admin/EnquiryDetailManager";

export const dynamic = "force-dynamic";

interface EnquiryDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminEnquiryDetailPage({
  params,
}: EnquiryDetailPageProps) {
  const enquiry = await getEnquiryDetailAction(params.id);

  if (!enquiry) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
        >
          <Link
            href="/admin/dashboard"
            className="hover:text-brand-charcoal-900 transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link
            href="/admin/enquiries"
            className="hover:text-brand-charcoal-900 transition-colors"
          >
            Enquiries
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {enquiry.referenceNumber} ({enquiry.customerName})
          </span>
        </nav>

        <Link
          href="/admin/enquiries"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Interactive Detail Manager */}
      <EnquiryDetailManager enquiry={enquiry} />
    </div>
  );
}
