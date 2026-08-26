"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Copy,
  Check,
  Calendar,
  Clock,
  Car,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Edit,
  History,
  Printer,
} from "lucide-react";
import {
  BookingItem,
  BookingStatus,
  DriverItem,
  BookingPaymentStatus,
  BookingPaymentMethod,
} from "@/types/booking";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import {
  updateBookingStatusAction,
  assignDriverAndVehicleAction,
  addBookingNoteAction,
  recordPaymentAction,
  checkConflictsAction,
} from "@/actions/bookingActions";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface BookingDetailManagerProps {
  booking: BookingItem;
  driversList: DriverItem[];
  ownedVehicles: { id: string; name: string }[];
}

export function BookingDetailManager({
  booking,
  driversList,
  ownedVehicles,
}: BookingDetailManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [copied, setCopied] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Driver & Vehicle assignment state
  const [selectedDriverId, setSelectedDriverId] = useState(booking.assignedDriverId || "");
  const [selectedVehicleId, setSelectedVehicleId] = useState(booking.assignedVehicleId || "");
  const [vehicleConflictWarning, setVehicleConflictWarning] = useState<string | null>(null);
  const [driverConflictWarning, setDriverConflictWarning] = useState<string | null>(null);

  // Check conflicts whenever driver or vehicle changes
  useEffect(() => {
    let isCancelled = false;

    async function runConflictCheck() {
      if (!selectedDriverId && !selectedVehicleId) {
        setDriverConflictWarning(null);
        setVehicleConflictWarning(null);
        return;
      }

      const conflicts = await checkConflictsAction({
        travelDate: booking.travelDate,
        returnDate: booking.returnDate,
        driverId: selectedDriverId || undefined,
        vehicleId: selectedVehicleId || undefined,
        excludeBookingId: booking.id,
      });

      if (!isCancelled) {
        setDriverConflictWarning(conflicts.driverConflict || null);
        setVehicleConflictWarning(conflicts.vehicleConflict || null);
      }
    }

    runConflictCheck();
    return () => {
      isCancelled = true;
    };
  }, [selectedDriverId, selectedVehicleId, booking.travelDate, booking.returnDate, booking.id]);

  // Payment recording state
  const [finalFareInput, setFinalFareInput] = useState<number | undefined>(booking.finalFare);
  const [advanceInput, setAdvanceInput] = useState<number>(booking.advanceReceived || 0);
  const [paymentStatusInput, setPaymentStatusInput] = useState<BookingPaymentStatus>(
    booking.paymentStatus || "not_recorded"
  );
  const [paymentMethodInput, setPaymentMethodInput] = useState<BookingPaymentMethod | undefined>(
    booking.paymentMethod
  );

  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleCopySummary = () => {
    const summary = `Sai Shraddha Tours & Travels, Shirdi\n\nBooking: ${booking.bookingReference}\nCustomer: ${booking.customerName} (${booking.customerMobile})\n\nPickup: ${booking.pickupLocation}${booking.pickupLandmark ? ` (${booking.pickupLandmark})` : ""}\nDestination: ${booking.destination}\nDate: ${booking.travelDate}${booking.pickupTime ? ` at ${booking.pickupTime}` : ""}\nPassengers: ${booking.passengerCount} Pax\nVehicle: ${booking.assignedVehicleName || booking.vehicleCategoryName || "SUV"}\nDriver: ${booking.assignedDriverName || "To be informed"}${booking.assignedDriverMobile ? ` (${booking.assignedDriverMobile})` : ""}\nAgreed Fare: ₹${booking.finalFare || booking.quotedFare || "Discussed"}\n\nEmergency / Help: Ramesh Shep 09890073081\nOffice: Sai Ashram (1000 Rooms), Shirdi`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStatusChange = (newStatus: BookingStatus, reason?: string) => {
    setActionMessage(null);
    startTransition(async () => {
      const res = await updateBookingStatusAction({
        id: booking.id,
        oldStatus: booking.status,
        newStatus,
        cancellationReason: reason,
      });
      if (res.success) {
        setActionMessage({
          type: "success",
          text: `Booking status updated to ${newStatus.toUpperCase()}.`,
        });
        setShowCancelModal(false);
        router.refresh();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to update status." });
      }
    });
  };

  const handleSaveAssignments = () => {
    setActionMessage(null);
    const driver = driversList.find((d) => d.id === selectedDriverId);
    const vehicle = ownedVehicles.find((v) => v.id === selectedVehicleId);

    startTransition(async () => {
      const res = await assignDriverAndVehicleAction({
        id: booking.id,
        driverId: selectedDriverId || undefined,
        driverName: driver?.name || undefined,
        driverMobile: driver?.mobileNumber || undefined,
        vehicleId: selectedVehicleId || undefined,
        vehicleName: vehicle?.name || undefined,
      });
      if (res.success) {
        setActionMessage({
          type: "success",
          text: "Vehicle & Driver assignment updated successfully.",
        });
        router.refresh();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to assign." });
      }
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    startTransition(async () => {
      const res = await addBookingNoteAction({
        bookingId: booking.id,
        note: newNote.trim(),
      });
      if (res.success) {
        setNewNote("");
        setActionMessage({ type: "success", text: "Internal note added." });
        router.refresh();
      }
    });
  };

  const handleSavePayment = () => {
    startTransition(async () => {
      const res = await recordPaymentAction({
        bookingId: booking.id,
        finalFare: finalFareInput,
        advanceReceived: advanceInput,
        paymentStatus: paymentStatusInput,
        paymentMethod: paymentMethodInput,
      });
      if (res.success) {
        setActionMessage({ type: "success", text: "Payment record updated." });
        router.refresh();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to record payment." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 1. Header Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-lg font-black text-brand-maroon">
                {booking.bookingReference}
              </span>
              <BookingStatusBadge status={booking.status} size="md" />
              <span className="text-[11px] text-stone-400 font-mono">
                Source: {booking.bookingSource}
              </span>
            </div>
            <div className="text-xs text-stone-500">
              Created: {new Date(booking.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </div>
          </div>

          {/* Direct Dialers & Clipboard */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={buildPhoneLink(booking.customerMobile)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-maroon text-white text-xs font-bold hover:bg-brand-maroon-800 transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Customer</span>
            </a>

            <a
              href={buildWhatsAppLink({
                customMessage: `Hello ${booking.customerName}, this is Sai Shraddha Tours & Travels regarding your confirmed booking ${booking.bookingReference} for ${booking.travelDate}.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Customer</span>
            </a>

            {booking.assignedDriverMobile && (
              <a
                href={buildPhoneLink(booking.assignedDriverMobile)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>Call Driver ({booking.assignedDriverName})</span>
              </a>
            )}

            <Link
              href={`/admin/bookings/print?id=${booking.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>Print Booking</span>
            </Link>

            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Summary!" : "Copy Summary"}</span>
            </button>
          </div>
        </div>

        {/* Operational Lifecycle Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-stone-400 mr-1">Dispatch Actions:</span>

          {booking.status === "draft" && (
            <Button
              size="sm"
              variant="primary"
              disabled={isPending}
              onClick={() => handleStatusChange("confirmed")}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Confirm Booking
            </Button>
          )}

          {booking.status === "confirmed" && (
            <Button
              size="sm"
              variant="primary"
              disabled={isPending}
              onClick={() => handleStatusChange("assigned")}
              leftIcon={<Car className="w-3.5 h-3.5" />}
            >
              Mark As Assigned
            </Button>
          )}

          {(booking.status === "confirmed" || booking.status === "assigned") && (
            <Button
              size="sm"
              variant="primary"
              disabled={isPending}
              onClick={() => handleStatusChange("in_progress")}
              leftIcon={<Play className="w-3.5 h-3.5" />}
              className="bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
            >
              Start Journey (In Progress)
            </Button>
          )}

          {booking.status === "in_progress" && (
            <Button
              size="sm"
              variant="primary"
              disabled={isPending}
              onClick={() => handleStatusChange("completed")}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              className="bg-emerald-800 hover:bg-emerald-900 border-emerald-800"
            >
              Complete Journey
            </Button>
          )}

          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                disabled={isPending}
                className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
              >
                Cancel Booking
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("no_show")}
                disabled={isPending}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Mark No-Show
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-brand-charcoal-900">
              Cancel Booking {booking.bookingReference}?
            </h3>
            <p className="text-xs text-stone-500">
              Please enter the reason for cancellation (e.g. Customer cancelled plans, vehicle breakdown, rescheduled trip).
            </p>
            <textarea
              rows={2}
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="e.g. Customer rescheduled pilgrimage to next month."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-brand-charcoal-900 bg-white"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Booking
              </Button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleStatusChange("cancelled", statusReason)}
                className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Grid Layout: Details & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer, Journey, Vehicle, Driver */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer & Journey Summary */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Customer & Journey Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Customer Name</span>
                <span className="font-bold text-sm text-brand-charcoal-900">{booking.customerName}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Mobile Number</span>
                <a href={buildPhoneLink(booking.customerMobile)} className="font-mono font-bold text-brand-maroon hover:underline">
                  {booking.customerMobile}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Pickup Location</span>
                <span className="font-semibold text-stone-800">
                  {booking.pickupLocation} {booking.pickupLandmark ? `(${booking.pickupLandmark})` : ""}
                </span>
                {booking.pickupNotes && (
                  <span className="block text-stone-500 text-[11px] mt-0.5">Note: {booking.pickupNotes}</span>
                )}
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Destination</span>
                <span className="font-bold text-brand-charcoal-900">
                  {booking.destination} {booking.destinationLandmark ? `(${booking.destinationLandmark})` : ""}
                </span>
                {booking.dropNotes && (
                  <span className="block text-stone-500 text-[11px] mt-0.5">Note: {booking.dropNotes}</span>
                )}
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Travel Departure</span>
                <span className="font-semibold text-stone-800">
                  🗓 {booking.travelDate} {booking.pickupTime ? `• ${booking.pickupTime}` : ""}
                </span>
                {booking.returnDate && (
                  <span className="block text-stone-500 text-[11px]">
                    Return: 🗓 {booking.returnDate} {booking.returnPickupTime ? `• ${booking.returnPickupTime}` : ""}
                  </span>
                )}
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Trip Type & Pax</span>
                <span className="font-semibold text-stone-800 capitalize">
                  {booking.tripType.replace(/_/g, " ")} • {booking.passengerCount} Adults
                  {booking.childrenCount ? `, ${booking.childrenCount} Children` : ""}
                </span>
              </div>
            </div>

            {/* Intermediate Stops */}
            {(booking.stops || []).length > 0 && (
              <div className="pt-3 border-t border-stone-100 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-stone-400">Intermediate Stops</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {booking.stops?.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-medium">
                      #{s.stopOrder} {s.location}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Journey Description / Customer Requirements */}
            {(booking.journeyDescription || booking.journeyNotes || booking.customerRequirements) && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                {booking.customerRequirements && (
                  <div>
                    <span className="font-bold block text-amber-950 mb-0.5">Customer Travel Requirements:</span>
                    <p className="whitespace-pre-wrap">{booking.customerRequirements}</p>
                  </div>
                )}
                {(booking.journeyDescription || booking.journeyNotes) && (
                  <div>
                    <span className="font-bold block text-amber-950 mb-0.5">Journey Itinerary:</span>
                    <p className="whitespace-pre-wrap">{booking.journeyDescription || booking.journeyNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Vehicle & Driver Dispatch Allocator */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider">
                Vehicle & Driver Allocation
              </h3>
              <span className="text-xs text-stone-400">
                Category: <strong>{booking.vehicleCategoryName || "SUV / MUV"}</strong>
              </span>
            </div>

            {/* Conflict Warnings */}
            {vehicleConflictWarning && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Vehicle Scheduling Warning:</span>
                  <span>{vehicleConflictWarning}</span>
                </div>
              </div>
            )}

            {driverConflictWarning && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Driver Scheduling Warning:</span>
                  <span>{driverConflictWarning}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Assigned Vehicle (Owned / Dedicated)
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="">Vehicle Not Assigned</option>
                  {ownedVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Assigned Driver
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white font-medium"
                >
                  <option value="">Driver Not Assigned</option>
                  {driversList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.mobileNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                variant="primary"
                disabled={isPending}
                onClick={handleSaveAssignments}
                className="text-xs font-bold"
              >
                Update Dispatch Assignment
              </Button>
            </div>
          </div>

          {/* Internal Notes History */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Internal Operations Notes
            </h3>

            {/* Note Input */}
            <div className="space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add private note (e.g. advance received via GPay, told customer to be ready at 6 AM)..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-brand-charcoal-900 bg-white"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending || !newNote.trim()}
                  onClick={handleAddNote}
                  className="text-xs font-bold"
                >
                  Add Private Note
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-2.5 pt-2">
              {(booking.notes || []).length === 0 ? (
                <p className="text-xs text-stone-400 italic">No notes recorded yet.</p>
              ) : (
                booking.notes?.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                      <span className="font-bold text-stone-700">{n.authorName}</span>
                      <span>{new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                    <p className="text-stone-800 whitespace-pre-wrap">{n.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Fare Tracker & Activity Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fare & Internal Payment Record */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Fare & Payment Record
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Final Agreed Fare (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={finalFareInput || ""}
                  onChange={(e) => setFinalFareInput(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 4200"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold text-brand-maroon bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-800">Advance Received (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={advanceInput}
                  onChange={(e) => setAdvanceInput(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold text-emerald-700 bg-white"
                />
              </div>

              {/* Calculated Balance */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-600">Balance Pending:</span>
                <span className="font-mono font-extrabold text-sm text-brand-charcoal-900">
                  ₹{finalFareInput != null ? Math.max(0, finalFareInput - advanceInput) : 0}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-stone-700">Payment Status</label>
                <select
                  value={paymentStatusInput}
                  onChange={(e) => setPaymentStatusInput(e.target.value as BookingPaymentStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="not_recorded">Not Recorded</option>
                  <option value="pending">Pending Payment</option>
                  <option value="partially_paid">Partially Paid (Advance)</option>
                  <option value="paid">Fully Paid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Payment Method</label>
                <select
                  value={paymentMethodInput || ""}
                  onChange={(e) => setPaymentMethodInput((e.target.value as BookingPaymentMethod) || undefined)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="">Select Method</option>
                  <option value="cash">Cash (Driver / Desk)</option>
                  <option value="upi">UPI (GPay / PhonePe)</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={isPending}
                  onClick={handleSavePayment}
                  className="w-full text-xs font-bold"
                >
                  Update Payment Record
                </Button>
              </div>
            </div>
          </div>

          {/* Activity / Timeline History */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <History className="w-4 h-4 text-stone-500" />
              <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider">
                Activity Timeline
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {(booking.activities || []).length === 0 ? (
                <p className="text-stone-400 italic">No activity logged yet.</p>
              ) : (
                booking.activities?.map((a) => (
                  <div key={a.id} className="border-l-2 border-brand-maroon/30 pl-3 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="font-bold text-stone-700">{a.actorName}</span>
                      <span>{new Date(a.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                    <p className="text-stone-700 text-xs">{a.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
