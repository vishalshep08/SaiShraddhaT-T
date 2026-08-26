"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  User,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
} from "lucide-react";
import { DriverItem, DriverStatus } from "@/types/booking";
import { saveDriverAction, toggleDriverStatusAction } from "@/actions/bookingActions";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";

interface DriverFormManagerProps {
  driver: DriverItem | null;
}

export function DriverFormManager({ driver }: DriverFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isNew = !driver || driver.id === "new";

  const [name, setName] = useState(driver?.name || "");
  const [mobileNumber, setMobileNumber] = useState(driver?.mobileNumber || "");
  const [alternateMobile, setAlternateMobile] = useState(driver?.alternateMobile || "");
  const [email, setEmail] = useState(driver?.email || "");
  const [status, setStatus] = useState<DriverStatus>(driver?.status || "available");
  const [notes, setNotes] = useState(driver?.notes || "");
  const [isActive, setIsActive] = useState<boolean>(driver?.isActive ?? true);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !mobileNumber.trim()) {
      setMessage({ type: "error", text: "Driver name and mobile number are required." });
      return;
    }

    startTransition(async () => {
      const res = await saveDriverAction({
        id: driver?.id,
        name: name.trim(),
        mobileNumber: mobileNumber.trim(),
        alternateMobile: alternateMobile.trim() || undefined,
        email: email.trim() || undefined,
        status,
        notes: notes.trim() || undefined,
        isActive,
      });

      if (res.success) {
        setMessage({
          type: "success",
          text: isNew ? "Driver registered successfully." : "Driver details updated successfully.",
        });
        if (isNew && res.id) {
          router.push(`/admin/drivers/${res.id}`);
        } else {
          router.refresh();
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save driver." });
      }
    });
  };

  const handleToggleActive = () => {
    if (!driver?.id || isNew) return;
    setMessage(null);

    startTransition(async () => {
      const newActive = !isActive;
      const res = await toggleDriverStatusAction({
        id: driver.id,
        isActive: newActive,
      });

      if (res.success) {
        setIsActive(newActive);
        if (!newActive) setStatus("inactive");
        else if (status === "inactive") setStatus("available");
        setMessage({
          type: "success",
          text: `Driver marked as ${newActive ? "Active" : "Inactive"}.`,
        });
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to toggle status." });
      }
    });
  };

  const cleanPhone = mobileNumber.replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
        `Hello ${name}, regarding travel booking assignment with Sai Shraddha Tours & Travels.`
      )}`
    : null;
  const phoneUrl = cleanPhone ? buildPhoneLink(mobileNumber) : null;

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
              <User className="w-4 h-4 text-brand-maroon" />
              Driver Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil / Raju Driver"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Primary Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 09890073081"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Alternate Mobile (Optional)
                </label>
                <input
                  type="tel"
                  value={alternateMobile}
                  onChange={(e) => setAlternateMobile(e.target.value)}
                  placeholder="e.g. 09689541883"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. driver@saishraddhatravels.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Operational Notes &amp; Route Familiarity
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Expert in Shirdi-Nashik-Trimbakeshwar and Shani Shingnapur routes. Knows Mumbai/Pune airport highways."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
            </div>
          </div>
        </div>

        {/* Status & Quick Contact Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal-900 border-b border-stone-100 pb-3">
              Driver Status &amp; Contact
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DriverStatus)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
                >
                  <option value="available">Available for Trip Assignment</option>
                  <option value="active">Active (On Call / Standby)</option>
                  <option value="assigned">Currently Assigned to Booking</option>
                  <option value="on_trip">Currently On Trip</option>
                  <option value="inactive">Inactive / On Leave</option>
                </select>
              </div>

              {!isNew && (
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-800">Active Status</p>
                    <p className="text-[11px] text-stone-400">
                      Inactive drivers are hidden from assignment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleActive}
                    disabled={isPending}
                    className="text-stone-600 hover:text-brand-charcoal-900 transition-colors"
                  >
                    {isActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-stone-400" />
                    )}
                  </button>
                </div>
              )}

              {/* Quick Communication for existing driver */}
              {!isNew && (phoneUrl || whatsappUrl) && (
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <p className="text-xs font-bold text-stone-700">Direct Actions</p>
                  <div className="flex gap-2">
                    {phoneUrl && (
                      <a
                        href={phoneUrl}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-brand-charcoal-900 text-xs font-bold rounded-lg transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    )}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
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
                    <span>{isNew ? "Register Driver" : "Save Changes"}</span>
                  </>
                )}
              </Button>

              <Link
                href="/admin/drivers"
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
