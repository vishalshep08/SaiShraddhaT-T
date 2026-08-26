"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Save,
  AlertTriangle,
  Plus,
  Trash2,
  Phone,
  MessageSquare,
  Car,
  User,
  Calendar,
} from "lucide-react";
import {
  BookingItem,
  BookingStatus,
  BookingPaymentStatus,
  BookingPaymentMethod,
  BookingSource,
  DriverItem,
  BookingStopItem,
} from "@/types/booking";
import { saveBookingAction, checkConflictsAction } from "@/actions/bookingActions";
import { TripType } from "@/types/enquiry";
import { Button } from "@/components/ui/Button";

interface BookingFormManagerProps {
  initialData: Partial<BookingItem>;
  driversList: DriverItem[];
  vehicleCategories: { id: string; name: string }[];
  ownedVehicles: { id: string; name: string }[];
}

export function BookingFormManager({
  initialData,
  driversList,
  vehicleCategories,
  ownedVehicles,
}: BookingFormManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<Partial<BookingItem>>({
    id: initialData.id,
    bookingReference: initialData.bookingReference || "",
    enquiryId: initialData.enquiryId || undefined,
    customerName: initialData.customerName || "",
    customerMobile: initialData.customerMobile || "",
    customerWhatsapp: initialData.customerWhatsapp || "",
    customerEmail: initialData.customerEmail || "",
    pickupLocation: initialData.pickupLocation || "Shirdi (Sai Ashram / Hotel)",
    pickupLandmark: initialData.pickupLandmark || "",
    destination: initialData.destination || "",
    destinationLandmark: initialData.destinationLandmark || "",
    travelDate: initialData.travelDate || new Date().toISOString().split("T")[0],
    pickupTime: initialData.pickupTime || "06:30 AM",
    returnDate: initialData.returnDate || "",
    returnPickupTime: initialData.returnPickupTime || "",
    tripType: (initialData.tripType as TripType) || "one_way",
    passengerCount: initialData.passengerCount || 4,
    childrenCount: initialData.childrenCount || 0,
    vehicleCategoryId: initialData.vehicleCategoryId || vehicleCategories[0]?.id || "",
    vehicleCategoryName: initialData.vehicleCategoryName || vehicleCategories[0]?.name || "SUV / MUV",
    assignedVehicleId: initialData.assignedVehicleId || "",
    assignedVehicleName: initialData.assignedVehicleName || "",
    assignedDriverId: initialData.assignedDriverId || "",
    assignedDriverName: initialData.assignedDriverName || "",
    assignedDriverMobile: initialData.assignedDriverMobile || "",
    quotedFare: initialData.quotedFare,
    finalFare: initialData.finalFare,
    advanceReceived: initialData.advanceReceived || 0,
    balanceAmount: initialData.balanceAmount || 0,
    paymentStatus: initialData.paymentStatus || "not_recorded",
    paymentMethod: initialData.paymentMethod || undefined,
    status: initialData.status || "confirmed",
    journeyNotes: initialData.journeyNotes || "",
    cancellationReason: initialData.cancellationReason || "",
    bookingSource: initialData.bookingSource || "website",
  });

  const [stops, setStops] = useState<BookingStopItem[]>(initialData.stops || []);
  const [conflictWarning, setConflictWarning] = useState<{ driver?: string; vehicle?: string }>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto calculate balance whenever finalFare or advanceReceived changes
  useEffect(() => {
    const finalVal = formData.finalFare != null ? Number(formData.finalFare) : undefined;
    const advanceVal = formData.advanceReceived != null ? Number(formData.advanceReceived) : 0;
    if (finalVal != null) {
      setFormData((prev) => ({ ...prev, balanceAmount: Math.max(0, finalVal - advanceVal) }));
    }
  }, [formData.finalFare, formData.advanceReceived]);

  // Check conflicts whenever travelDate, driver, or vehicle changes
  useEffect(() => {
    async function check() {
      if (formData.travelDate && (formData.assignedDriverId || formData.assignedVehicleId)) {
        const res = await checkConflictsAction({
          travelDate: formData.travelDate,
          driverId: formData.assignedDriverId || undefined,
          vehicleId: formData.assignedVehicleId || undefined,
          excludeBookingId: formData.id,
        });
        setConflictWarning({
          driver: res.driverConflict,
          vehicle: res.vehicleConflict,
        });
      } else {
        setConflictWarning({});
      }
    }
    check();
  }, [formData.travelDate, formData.assignedDriverId, formData.assignedVehicleId, formData.id]);

  const handleDriverChange = (driverId: string) => {
    if (!driverId) {
      setFormData((prev) => ({
        ...prev,
        assignedDriverId: "",
        assignedDriverName: "",
        assignedDriverMobile: "",
      }));
      return;
    }
    const found = driversList.find((d) => d.id === driverId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        assignedDriverId: found.id,
        assignedDriverName: found.name,
        assignedDriverMobile: found.mobileNumber,
        status: prev.status === "confirmed" ? "assigned" : prev.status,
      }));
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    if (!vehicleId) {
      setFormData((prev) => ({
        ...prev,
        assignedVehicleId: "",
        assignedVehicleName: "",
      }));
      return;
    }
    const found = ownedVehicles.find((v) => v.id === vehicleId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        assignedVehicleId: found.id,
        assignedVehicleName: found.name,
        status: prev.status === "confirmed" ? "assigned" : prev.status,
      }));
    }
  };

  const handleAddStop = () => {
    setStops((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        bookingId: formData.id || "",
        stopOrder: prev.length + 1,
        location: "",
        landmark: "",
        notes: "",
      },
    ]);
  };

  const handleRemoveStop = (idx: number) => {
    setStops((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleStopLocationChange = (idx: number, val: string) => {
    setStops((prev) => {
      const updated = [...prev];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], location: val };
      }
      return updated;
    });
  };

  const handleSubmit = (statusToSave?: BookingStatus) => {
    setMessage(null);

    // Validation: Return date must be after travel date if provided
    if (formData.returnDate && formData.travelDate && formData.returnDate < formData.travelDate) {
      setMessage({
        type: "error",
        text: "Validation Error: Return date cannot be earlier than departure travel date.",
      });
      return;
    }

    const payload = {
      ...formData,
      status: statusToSave || formData.status,
      stops: stops.filter((s) => s.location.trim().length > 0),
    };

    startTransition(async () => {
      const res = await saveBookingAction(payload);
      if (res.success) {
        setMessage({
          type: "success",
          text: "Booking record saved and operations timeline updated.",
        });
        router.refresh();
        if ((!initialData.id || initialData.id === "new") && res.id) {
          router.push(`/admin/bookings/${res.id}`);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save booking." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
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

      {/* Conflict Warning Alert */}
      {(conflictWarning.driver || conflictWarning.vehicle) && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Operational Schedule Warning: Overlapping Assignment</span>
          </div>
          {conflictWarning.driver && <p className="pl-5">• {conflictWarning.driver}</p>}
          {conflictWarning.vehicle && <p className="pl-5">• {conflictWarning.vehicle}</p>}
          <p className="pl-5 text-[11px] text-amber-800 font-medium">
            You may choose a different driver/vehicle or proceed if this is an intentional split-shift.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Core Booking Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Customer Information */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              1. Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Mobile Number (Primary Dial) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerMobile}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerMobile: e.target.value }))}
                  placeholder="e.g. 09890073081"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.customerWhatsapp || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerWhatsapp: e.target.value }))}
                  placeholder="e.g. 09890073081"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.customerEmail || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="customer@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Journey & Schedule */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              2. Journey & Pickup Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                  placeholder="e.g. Sai Ashram (Bhakta Niwas 1000 Rooms)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g. Nashik & Trimbakeshwar Jyotirlinga"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Travel Departure Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.travelDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, travelDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Pickup Time
                </label>
                <input
                  type="text"
                  value={formData.pickupTime || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pickupTime: e.target.value }))}
                  placeholder="e.g. 06:30 AM (Kakad Aarti / Morning)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Return Date (If Roundtrip / Multi-Day)
                </label>
                <input
                  type="date"
                  value={formData.returnDate || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Trip Type
                </label>
                <select
                  value={formData.tripType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tripType: e.target.value as TripType }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                >
                  <option value="one_way">One Way Transfer</option>
                  <option value="round_trip">Round Trip (Same Day)</option>
                  <option value="local">Shirdi Local Sightseeing</option>
                  <option value="airport_transfer">Shirdi / Pune / Mumbai Airport Drop</option>
                  <option value="multi_day">Multi-Day Pilgrimage Circuit</option>
                  <option value="custom">Custom Itinerary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Passengers (Adults)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={formData.passengerCount || 1}
                  onChange={(e) => setFormData((prev) => ({ ...prev, passengerCount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Children Count
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={formData.childrenCount || 0}
                  onChange={(e) => setFormData((prev) => ({ ...prev, childrenCount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                />
              </div>
            </div>

            {/* Journey Stops Repeater */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">
                  Intermediate Stops (e.g. Shani Shingnapur, Muktidham, Bhadra Maruti)
                </label>
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Stop
                </button>
              </div>

              {stops.map((stop, idx) => (
                <div key={stop.id} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400 w-5">#{idx + 1}</span>
                  <input
                    type="text"
                    value={stop.location}
                    onChange={(e) => handleStopLocationChange(idx, e.target.value)}
                    placeholder="e.g. Muktidham Temple or Shani Shingnapur Darshan"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-brand-charcoal-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600"
                    title="Remove Stop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Vehicle & Driver Allocation */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              3. Vehicle & Driver Allocation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Vehicle Category
                </label>
                <select
                  value={formData.vehicleCategoryId || ""}
                  onChange={(e) => {
                    const cat = vehicleCategories.find((c) => c.id === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      vehicleCategoryId: e.target.value,
                      vehicleCategoryName: cat?.name || prev.vehicleCategoryName,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                >
                  <option value="">Select Category</option>
                  {vehicleCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Assign Specific Vehicle (Owned / Partner)
                </label>
                <select
                  value={formData.assignedVehicleId || ""}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="">Vehicle Not Assigned Yet</option>
                  {ownedVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (Owned Core Fleet)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-brand-charcoal-900">
                  Assign Driver
                </label>
                <select
                  value={formData.assignedDriverId || ""}
                  onChange={(e) => handleDriverChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                >
                  <option value="">Driver Not Assigned Yet</option>
                  {driversList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.mobileNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Operational Notes */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              4. Operational Notes (Private)
            </h3>
            <textarea
              rows={3}
              value={formData.journeyNotes || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, journeyNotes: e.target.value }))}
              placeholder="e.g. Elderly parents travelling, requested slow speed; hotel pickup at Hotel Sai Leela 6:30 AM sharp; luggage 4 medium bags."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
            />
          </div>
        </div>

        {/* Right Column: Status & Fare Tracking */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Source Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Booking Status & Source
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Lifecycle Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as BookingStatus }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold text-brand-charcoal-900 bg-white"
                >
                  <option value="confirmed">✓ Confirmed</option>
                  <option value="assigned">🚗 Assigned</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="completed">✓ Completed</option>
                  <option value="draft">● Draft</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Booking Source</label>
                <select
                  value={formData.bookingSource}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bookingSource: e.target.value as BookingSource }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="website">Website Online Enquiry</option>
                  <option value="phone">Direct Phone Call</option>
                  <option value="whatsapp">WhatsApp Enquiry</option>
                  <option value="walk_in">Walk-in (Sai Ashram Desk)</option>
                  <option value="referral">Hotel / Friend Referral</option>
                  <option value="existing_customer">Repeat Devotee Customer</option>
                  <option value="other">Other Source</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fare & Internal Payment Record Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Fare & Payment Record
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Quoted Fare (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.quotedFare || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quotedFare: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="e.g. 4500"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold text-brand-charcoal-900 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-900">Final Agreed Fare (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.finalFare || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, finalFare: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="e.g. 4200"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold text-brand-maroon bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-800">Advance Received (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.advanceReceived || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, advanceReceived: Number(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold text-emerald-700 bg-white"
                />
              </div>

              {/* Calculated Balance */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-600">Balance Pending:</span>
                <span className="font-mono font-extrabold text-sm text-brand-charcoal-900">
                  ₹{formData.balanceAmount || 0}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-stone-700">Payment Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paymentStatus: e.target.value as BookingPaymentStatus }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="not_recorded">Not Recorded</option>
                  <option value="pending">Pending Payment</option>
                  <option value="partially_paid">Partially Paid (Advance)</option>
                  <option value="paid">Fully Paid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Internal Payment Method</label>
                <select
                  value={formData.paymentMethod || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: (e.target.value as BookingPaymentMethod) || undefined }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white"
                >
                  <option value="">Select Method</option>
                  <option value="cash">Cash (Driver / Desk)</option>
                  <option value="upi">UPI (GPay / PhonePe QR)</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <Button
                type="button"
                size="md"
                variant="primary"
                disabled={isPending}
                onClick={() => handleSubmit("confirmed")}
                className="w-full font-bold text-xs"
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isPending ? "Saving Booking..." : "Save & Confirm Booking"}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => handleSubmit("draft")}
                className="w-full text-xs font-semibold"
              >
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
