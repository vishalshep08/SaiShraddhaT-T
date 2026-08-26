import React from "react";
import Link from "next/link";
import { Plus, HelpCircle, Edit, CheckCircle2, XCircle } from "lucide-react";
import { getAdminFAQsAction } from "@/actions/trustActions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface AdminFAQsPageProps {
  searchParams: {
    category?: string;
    status?: string;
    search?: string;
  };
}

export default async function AdminFAQsPage({ searchParams }: AdminFAQsPageProps) {
  const currentCategory = searchParams.category || "all";
  const faqs = await getAdminFAQsAction({
    category: currentCategory,
    status: searchParams.status,
    search: searchParams.search,
  });

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "general", label: "General" },
    { id: "pilgrimage", label: "Pilgrimage" },
    { id: "shirdi_travel", label: "Shirdi Travel" },
    { id: "vehicle", label: "Vehicles" },
    { id: "booking", label: "Booking" },
    { id: "airport_transfer", label: "Airport Transfer" },
    { id: "outstation", label: "Outstation" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Frequently Asked Questions (FAQs)
            </h1>
            <Badge variant="maroon" size="sm">
              {faqs.length} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage genuine answers for customer queries displayed across the website.
          </p>
        </div>

        <Link href="/admin/faqs/new">
          <Button variant="primary" size="md" className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </Button>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto whitespace-nowrap">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/faqs${c.id === "all" ? "" : `?category=${c.id}`}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              currentCategory === c.id
                ? "bg-brand-maroon text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* FAQs List */}
      {faqs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-sm font-bold text-stone-700">No FAQs found.</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Add genuine customer questions and answers about booking, darshan timings, or vehicles.
          </p>
          <Link href="/admin/faqs/new" className="inline-block pt-2">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add First FAQ
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {faq.category.replace("_", " ")}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      faq.status === "published"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {faq.status}
                  </span>
                  <span className="text-[11px] text-stone-400">Order: {faq.displayOrder}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-brand-charcoal-900 leading-snug">
                  {faq.question}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {faq.answer}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Link href={`/admin/faqs/${faq.id}`}>
                  <Button variant="outline" size="sm" className="text-xs py-1 h-7 font-bold">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
