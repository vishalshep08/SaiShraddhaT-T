"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Copy,
  Check,
  Clock,
  Send,
  Loader2,
  FileText,
  Calendar,
  AlertCircle,
  History,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { AdminEnquiryItem } from "@/types/admin";
import { EnquiryStatus } from "@/types/enquiry";
import {
  updateEnquiryStatusAction,
  addEnquiryNoteAction,
  setEnquiryFollowUpAction,
  archiveEnquiryAction,
} from "@/actions/adminEnquiryActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface EnquiryDetailManagerProps {
  enquiry: AdminEnquiryItem;
}

export function EnquiryDetailManager({ enquiry }: EnquiryDetailManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState<EnquiryStatus>(enquiry.status);
  const [statusNote, setStatusNote] = useState("");
  const [newNote, setNewNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState(
    enquiry.followUpAt ? enquiry.followUpAt.split("T")[0] : ""
  );
  const [followUpNote, setFollowUpNote] = useState("");

  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy customer summary
  const handleCopySummary = () => {
    const summary = `Enquiry: ${enquiry.referenceNumber}\nCustomer: ${enquiry.customerName} (${enquiry.mobileNumber})\nRoute: ${enquiry.pickupLocation} -> ${enquiry.destination}\nDate: ${enquiry.travelDate || "TBD"}\nPax: ${enquiry.passengerCount}\nVehicle: ${enquiry.vehiclePreferenceText || "Any"}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status update
  const handleStatusChange = (newStatus: EnquiryStatus) => {
    if (newStatus === currentStatus) return;

    if (newStatus === "confirmed") {
      const confirmOk = window.confirm(
        `Are you sure you want to mark enquiry ${enquiry.referenceNumber} as CONFIRMED?`
      );
      if (!confirmOk) return;
    }

    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      const res = await updateEnquiryStatusAction({
        id: enquiry.id,
        oldStatus: currentStatus,
        newStatus,
        note: statusNote.trim() || undefined,
      });

      if (res.success) {
        setCurrentStatus(newStatus);
        setStatusNote("");
        setSuccessMessage(`Status updated to ${newStatus.replace("_", " ")}.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || "Failed to update status.");
      }
    });
  };

  // Add internal note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      const res = await addEnquiryNoteAction({
        enquiryId: enquiry.id,
        note: newNote.trim(),
      });

      if (res.success) {
        setNewNote("");
        setSuccessMessage("Private note saved successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || "Failed to save note.");
      }
    });
  };

  // Set follow up
  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;

    startTransition(async () => {
      const res = await setEnquiryFollowUpAction({
        id: enquiry.id,
        followUpDate,
        note: followUpNote.trim() || undefined,
      });

      if (res.success) {
        setCurrentStatus("follow_up");
        setFollowUpNote("");
        setSuccessMessage("Follow-up date scheduled successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || "Failed to schedule follow-up.");
      }
    });
  };

  const whatsappMessage = `Hello ${enquiry.customerName}, this is Sai Shraddha Tours & Travels, Shirdi regarding your travel enquiry (${enquiry.referenceNumber}) for ${enquiry.pickupLocation} to ${enquiry.destination}.`;

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Primary Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusBadge status={currentStatus} size="md" />
          <div className="text-xs text-stone-500">
            Received:{" "}
            {new Intl.DateTimeFormat("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(enquiry.createdAt))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Summary"}</span>
          </button>

          <Link
            href={`/admin/bookings/new?enquiry_id=${enquiry.id}`}
            className="px-4 py-2 rounded-xl bg-brand-charcoal-900 text-white hover:bg-brand-charcoal-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-saffron" />
            <span>Convert to Booking</span>
          </Link>

          <a
            href={buildPhoneLink(enquiry.mobileNumber)}
            className="px-4 py-2 rounded-xl bg-brand-maroon text-white hover:bg-brand-maroon-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Customer</span>
          </a>

          <a
            href={buildWhatsAppLink({
              customMessage: whatsappMessage,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Customer</span>
          </a>
        </div>
      </div>

      {/* 2. Grid: Journey & Customer Details + Status & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer & Journey Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 block font-medium">Customer Name</span>
                <span className="font-bold text-sm text-brand-charcoal-900">
                  {enquiry.customerName}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block font-medium">Calling Mobile</span>
                <a
                  href={buildPhoneLink(enquiry.mobileNumber)}
                  className="font-mono font-bold text-brand-maroon hover:underline"
                >
                  {enquiry.mobileNumber}
                </a>
              </div>

              {enquiry.whatsappNumber && (
                <div>
                  <span className="text-stone-400 block font-medium">WhatsApp Number</span>
                  <span className="font-mono font-semibold text-stone-700">
                    {enquiry.whatsappNumber}
                  </span>
                </div>
              )}

              {enquiry.email && (
                <div>
                  <span className="text-stone-400 block font-medium">Email Address</span>
                  <span className="text-stone-700">{enquiry.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Journey Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Journey Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block font-medium">Pickup Location</span>
                <span className="font-bold text-stone-900">{enquiry.pickupLocation}</span>
              </div>

              <div>
                <span className="text-stone-400 block font-medium">Destination / Tour</span>
                <span className="font-bold text-brand-maroon">{enquiry.destination}</span>
              </div>

              <div>
                <span className="text-stone-400 block font-medium">Trip Type</span>
                <span className="capitalize font-semibold text-stone-800">
                  {enquiry.tripType.replace("_", " ")}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block font-medium">Travel Date</span>
                <span className="font-bold text-stone-900">
                  {enquiry.travelDate
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(enquiry.travelDate))
                    : "Not specified (Quote enquiry)"}
                </span>
              </div>

              {enquiry.returnDate && (
                <div>
                  <span className="text-stone-400 block font-medium">Return Date</span>
                  <span className="font-semibold text-stone-800">
                    {new Intl.DateTimeFormat("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(enquiry.returnDate))}
                  </span>
                </div>
              )}

              {enquiry.pickupTime && (
                <div>
                  <span className="text-stone-400 block font-medium">Pickup Time</span>
                  <span className="font-semibold text-stone-800">{enquiry.pickupTime}</span>
                </div>
              )}

              <div>
                <span className="text-stone-400 block font-medium">Passengers</span>
                <span className="font-semibold text-stone-800">
                  {enquiry.passengerCount} Adults
                  {enquiry.childrenCount ? ` + ${enquiry.childrenCount} Children` : ""}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block font-medium">Vehicle Preference</span>
                <span className="font-semibold text-stone-800">
                  {enquiry.vehiclePreferenceText || "No preference specified"}
                </span>
              </div>
            </div>

            {/* Source Attribution */}
            <div className="pt-2 border-t border-stone-100 space-y-1 text-[11px] text-stone-400">
              {enquiry.landingPage && (
                <div>
                  <span className="font-medium text-stone-500">Landing Page: </span>
                  <span className="font-mono text-stone-600">{enquiry.landingPage}</span>
                </div>
              )}
              {enquiry.contextType && (
                <div>
                  <span className="font-medium text-stone-500">Context Type: </span>
                  <span className="capitalize text-stone-600">{enquiry.contextType.replace("_", " ")}</span>
                </div>
              )}
              {(enquiry.utmSource || enquiry.utmMedium || enquiry.utmCampaign) && (
                <div className="flex flex-wrap gap-3">
                  {enquiry.utmSource && (
                    <span>Source: <span className="font-mono text-stone-600">{enquiry.utmSource}</span></span>
                  )}
                  {enquiry.utmMedium && (
                    <span>Medium: <span className="font-mono text-stone-600">{enquiry.utmMedium}</span></span>
                  )}
                  {enquiry.utmCampaign && (
                    <span>Campaign: <span className="font-mono text-stone-600">{enquiry.utmCampaign}</span></span>
                  )}
                </div>
              )}
              {!enquiry.landingPage && !enquiry.contextType && (
                <span>Source Page: <span className="font-mono text-stone-600">{enquiry.sourcePage || "/"}</span></span>
              )}
            </div>
          </div>

          {/* Customer Message Card */}
          {enquiry.additionalRequirements && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-maroon" />
                Additional Customer Requirements
              </h3>
              <p className="text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-100 leading-relaxed whitespace-pre-wrap">
                {enquiry.additionalRequirements}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Status Transition + Follow Up + Private Notes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Change Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Update Lead Status
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Change Status To:</label>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                  disabled={isPending}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                >
                  <option value="new">● New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quote_discussed">Quote Discussed</option>
                  <option value="follow_up">⏱ Follow-up</option>
                  <option value="confirmed">✓ Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-500">Optional transition note:</label>
                <input
                  type="text"
                  placeholder="e.g. Quoted ₹3,200 for Ertiga, customer will confirm..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-brand-charcoal-900 bg-stone-50 placeholder-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Follow-up Scheduler Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Schedule Follow-up Date
            </h3>

            <form onSubmit={handleScheduleFollowUp} className="space-y-3">
              <input
                type="date"
                required
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-brand-charcoal-900 bg-white"
              />

              <input
                type="text"
                placeholder="Follow-up note (e.g. Call after morning kakad aarti)..."
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-brand-charcoal-900 bg-stone-50 placeholder-stone-400"
              />

              <Button
                type="submit"
                size="sm"
                variant="outline"
                disabled={isPending}
                className="w-full text-xs font-bold"
              >
                Set Follow-up
              </Button>
            </form>
          </div>

          {/* Private Internal Notes Log */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Private Staff Notes ({enquiry.notes?.length || 0})
            </h3>

            {/* New Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                required
                placeholder="Add private staff note (e.g. Driver Ramesh allocated / advance ₹500 received offline)..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon resize-none"
              />

              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={isPending || !newNote.trim()}
                className="w-full text-xs font-bold"
              >
                Save Private Note
              </Button>
            </form>

            {/* Notes History */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pt-2 divide-y divide-stone-100">
              {enquiry.notes && enquiry.notes.length > 0 ? (
                enquiry.notes.map((n) => (
                  <div key={n.id} className="pt-2 text-xs space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="font-bold text-stone-600">{n.authorName}</span>
                      <span>
                        {new Intl.DateTimeFormat("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(n.createdAt))}
                      </span>
                    </div>
                    <p className="text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-100 text-xs leading-relaxed">
                      {n.note}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 text-center py-2">
                  No notes recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
