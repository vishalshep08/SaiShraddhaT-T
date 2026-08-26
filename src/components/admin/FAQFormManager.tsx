"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, HelpCircle, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { FAQItem, FAQCategory, FAQStatus } from "@/types/trust";
import { saveFAQAction, toggleFAQStatusAction } from "@/actions/trustActions";
import { Button } from "@/components/ui/Button";

interface FAQFormManagerProps {
  faq: FAQItem | null;
}

export function FAQFormManager({ faq }: FAQFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isNew = !faq || faq.id === "new";

  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [category, setCategory] = useState<FAQCategory>(faq?.category || "general");
  const [contextType, setContextType] = useState<string>(faq?.contextType || "general");
  const [contextSlug, setContextSlug] = useState<string>(faq?.contextSlug || "");
  const [displayOrder, setDisplayOrder] = useState<number>(faq?.displayOrder || 0);
  const [status, setStatus] = useState<FAQStatus>(faq?.status || "published");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!question.trim() || !answer.trim()) {
      setMessage({ type: "error", text: "Question and answer are required." });
      return;
    }

    startTransition(async () => {
      const res = await saveFAQAction({
        id: faq?.id,
        question: question.trim(),
        answer: answer.trim(),
        category,
        contextType: contextType as any,
        contextSlug: contextSlug.trim() || undefined,
        displayOrder: Number(displayOrder) || 0,
        status,
      });

      if (res.success) {
        setMessage({
          type: "success",
          text: isNew ? "FAQ created successfully." : "FAQ updated successfully.",
        });
        if (isNew && res.id) {
          router.push(`/admin/faqs/${res.id}`);
        } else {
          router.refresh();
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save FAQ." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-maroon" />
              Question &amp; Answer Content
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Question <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Can we book an Ertiga for Shirdi to Trimbakeshwar and return on the same day?"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Answer <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Provide a clear, genuine answer without fluff..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3">
              Categorization &amp; Status
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FAQCategory)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white capitalize"
                >
                  <option value="general">General Queries</option>
                  <option value="shirdi_travel">Shirdi Travel &amp; Local</option>
                  <option value="pilgrimage">Pilgrimage &amp; Temple Darshan</option>
                  <option value="vehicle">Vehicles &amp; Fleet</option>
                  <option value="booking">Booking &amp; Quotations</option>
                  <option value="airport_transfer">Airport &amp; Railway Transfers</option>
                  <option value="outstation">Outstation Journeys</option>
                  <option value="group_travel">Group Travel</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Publication Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FAQStatus)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white"
                >
                  <option value="published">Published (Visible on site)</option>
                  <option value="draft">Draft (Admin only)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300"
                />
                <p className="text-[11px] text-stone-400">Lower numbers appear first.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isPending}
                className="w-full font-bold flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isNew ? "Create FAQ" : "Save FAQ"}</span>
                  </>
                )}
              </Button>

              <Link
                href="/admin/faqs"
                className="w-full py-2 text-center text-xs font-semibold text-stone-600 hover:text-brand-charcoal-900 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
