import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getAdminFAQByIdAction } from "@/actions/trustActions";
import { FAQFormManager } from "@/components/admin/FAQFormManager";

export const dynamic = "force-dynamic";

interface AdminFAQDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminFAQDetailPage({
  params,
}: AdminFAQDetailPageProps) {
  const isNew = params.id === "new";
  const faq = isNew ? null : await getAdminFAQByIdAction(params.id);

  if (!isNew && !faq) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/admin/dashboard" className="hover:text-brand-charcoal-900">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/admin/faqs" className="hover:text-brand-charcoal-900">
            FAQs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {isNew ? "Add FAQ" : "Edit FAQ"}
          </span>
        </nav>

        <Link
          href="/admin/faqs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to FAQs</span>
        </Link>
      </div>

      <FAQFormManager faq={faq} />
    </div>
  );
}
