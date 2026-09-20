"use client";

import React, { useState, useTransition } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  EnquiryContextData,
  EnquiryFormData,
  EnquirySubmissionResult,
  RequestIntent,
  TripType,
} from "@/types/enquiry";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";
import { submitEnquiryAction } from "@/actions/enquiryActions";
import { EnquirySuccessCard } from "@/components/enquiry/EnquirySuccessCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EnquiryFormProps {
  initialContext?: EnquiryContextData;
  onSuccess?: (result: EnquirySubmissionResult) => void;
  className?: string;
  isModal?: boolean;
}

export function EnquiryForm({
  initialContext = {},
  onSuccess,
  className = "",
  isModal = false,
}: EnquiryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submissionResult, setSubmissionResult] =
    useState<EnquirySubmissionResult | null>(null);

  // Intent: "quote" vs "booking_request"
  const [intent, setIntent] = useState<RequestIntent>(
    initialContext.requestIntent || "quote"
  );

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState("");

  const [pickupLocation, setPickupLocation] = useState(
    initialContext.origin || "Shirdi"
  );
  const [destination, setDestination] = useState(
    initialContext.destination ||
      initialContext.packageName ||
      initialContext.serviceName ||
      ""
  );
  const [tripType, setTripType] = useState<TripType>(
    initialContext.tripType || "one_way"
  );
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [passengerCount, setPassengerCount] = useState<number>(4);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [vehicleCategorySlug, setVehicleCategorySlug] = useState<string>(
    initialContext.vehicleCategorySlug || ""
  );
  const [additionalRequirements, setAdditionalRequirements] = useState("");

  // Honeypot spam trap
  const [honeypot, setHoneypot] = useState("");

  // Validation Errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Basic client validation
    const errors: Record<string, string> = {};
    if (!customerName.trim()) {
      errors.customerName = "Please enter your name.";
    }
    if (!mobileNumber.trim()) {
      errors.mobileNumber = "Please enter your 10-digit mobile number.";
    }
    if (!pickupLocation.trim()) {
      errors.pickupLocation = "Please enter pickup location.";
    }
    if (!destination.trim()) {
      errors.destination = "Please enter destination or tour.";
    }
    if (intent === "booking_request" && !travelDate) {
      errors.travelDate = "Please select travel date.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload: EnquiryFormData = {
      website_field_hp: honeypot,
      requestIntent: intent,
      enquiryType: initialContext.enquiryType || "general",
      sourcePage:
        initialContext.sourcePage ||
        (typeof window !== "undefined" ? window.location.pathname : "direct_form"),
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      whatsappNumber: sameAsMobile ? mobileNumber.trim() : whatsappNumber.trim(),
      sameAsMobile,
      email: email.trim(),
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim(),
      tripType,
      travelDate: travelDate || undefined,
      returnDate: returnDate || undefined,
      pickupTime: pickupTime.trim() || undefined,
      passengerCount: Number(passengerCount) || 1,
      childrenCount: Number(childrenCount) || 0,
      vehicleCategorySlug: vehicleCategorySlug || undefined,
      additionalRequirements: additionalRequirements.trim() || undefined,
      serviceSlug: initialContext.serviceSlug,
      routeSlug: initialContext.routeSlug,
      destinationSlug: initialContext.destinationSlug,
      packageSlug: initialContext.packageSlug,
      utmSource: initialContext.utmSource,
      utmMedium: initialContext.utmMedium,
      utmCampaign: initialContext.utmCampaign,
    };

    startTransition(async () => {
      const result = await submitEnquiryAction(payload);
      if (result.success) {
        setSubmissionResult(result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setGeneralError(
          result.error ||
            "Unable to submit enquiry. Please call or WhatsApp us directly."
        );
      }
    });
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setGeneralError(null);
    setFieldErrors({});
  };

  if (submissionResult && submissionResult.success) {
    return <EnquirySuccessCard result={submissionResult} onReset={handleReset} />;
  }

  // Today's date string for min date in picker
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 text-left ${className}`}
      noValidate
    >
      {/* 1. Header & Intent Switcher */}
      <div className="space-y-3 border-b border-stone-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Serving Shirdi Since 2014 • Sai Ashram Desk</span>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIntent("quote")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                intent === "quote"
                  ? "bg-white text-brand-charcoal-900 shadow-xs"
                  : "text-stone-500 hover:text-brand-charcoal-900"
              }`}
            >
              Get a Quote
            </button>
            <button
              type="button"
              onClick={() => setIntent("booking_request")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                intent === "booking_request"
                  ? "bg-brand-maroon text-white shadow-xs"
                  : "text-stone-500 hover:text-brand-charcoal-900"
              }`}
            >
              Request Booking
            </button>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-brand-charcoal-900 tracking-tight">
          {intent === "quote"
            ? "Request a Journey Quotation"
            : "Request a Cab Booking from Shirdi"}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600">
          {intent === "quote"
            ? "Tell us your travel plan. Ramesh Shep (Owner) will provide an exact, upfront fare with zero hidden costs."
            : "Share your schedule and vehicle preference. Our team will verify vehicle availability and confirm your trip."}
        </p>
      </div>

      {/* General Error Alert */}
      {generalError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Honeypot Spam Bot Trap (hidden) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_field_hp">Leave empty</label>
        <input
          type="text"
          id="website_field_hp"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* 2. SECTION 1: TRIP & ROUTE DETAILS */}
      <div className="space-y-4">
        <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">
          1. Your Journey Details
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pickup Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-maroon" />
              Pickup Location <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shirdi (Sai Ashram / Hotel Name)"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
                fieldErrors.pickupLocation ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
              }`}
            />
            {fieldErrors.pickupLocation && (
              <p className="text-[11px] text-rose-600">{fieldErrors.pickupLocation}</p>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-maroon" />
              Destination / Tour <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nashik, Mumbai, Shani Shingnapur..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
                fieldErrors.destination ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
              }`}
            />
            {fieldErrors.destination && (
              <p className="text-[11px] text-rose-600">{fieldErrors.destination}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Trip Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900">
              Trip Type
            </label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value as TripType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            >
              <option value="one_way">One-Way Drop</option>
              <option value="round_trip">Round Trip / Return</option>
              <option value="local">Shirdi Local Sightseeing</option>
              <option value="multi_day">Multi-Day Tour / Yatra</option>
              <option value="airport_transfer">Airport Transfer</option>
              <option value="custom_trip">Custom Route</option>
            </select>
          </div>

          {/* Travel Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-maroon" />
              Travel Date {intent === "booking_request" && <span className="text-rose-600">*</span>}
            </label>
            <input
              type="date"
              min={todayStr}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
                fieldErrors.travelDate ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
              }`}
            />
            {fieldErrors.travelDate && (
              <p className="text-[11px] text-rose-600">{fieldErrors.travelDate}</p>
            )}
          </div>

          {/* Pickup Time */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-maroon" />
              Pickup Time (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 7:00 AM / Kakad Aarti"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            />
          </div>
        </div>

        {/* Return Date (only if Round Trip or Multi-day) */}
        {(tripType === "round_trip" || tripType === "multi_day") && (
          <div className="space-y-1 max-w-xs">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-maroon" />
              Return Date (Optional)
            </label>
            <input
              type="date"
              min={travelDate || todayStr}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            />
            {fieldErrors.returnDate && (
              <p className="text-[11px] text-rose-600">{fieldErrors.returnDate}</p>
            )}
          </div>
        )}
      </div>

      {/* 3. SECTION 2: PASSENGERS & VEHICLE */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">
          2. Passengers & Vehicle Selection
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Passenger Count */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-maroon" />
              Adult Passengers <span className="text-rose-600">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={passengerCount}
              onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
                fieldErrors.passengerCount ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
              }`}
            />
            {fieldErrors.passengerCount && (
              <p className="text-[11px] text-rose-600">{fieldErrors.passengerCount}</p>
            )}
          </div>

          {/* Children Count */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900">
              Children (Optional)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={childrenCount}
              onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            />
          </div>

          {/* Vehicle Preference */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-brand-maroon" />
              Vehicle Preference
            </label>
            <select
              value={vehicleCategorySlug}
              onChange={(e) => setVehicleCategorySlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            >
              <option value="">No Preference / Advise Me</option>
              {VEHICLE_CATEGORIES.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.name} ({v.ownershipLabel})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. SECTION 3: CONTACT INFORMATION */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">
          3. Contact Details
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-brand-maroon" />
              Full Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
                fieldErrors.customerName ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
              }`}
            />
            {fieldErrors.customerName && (
              <p className="text-[11px] text-rose-600">{fieldErrors.customerName}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-brand-maroon" />
              Mobile Number (Calling) <span className="text-rose-600">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={15}
              placeholder="e.g. 98900 73081"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
                fieldErrors.mobileNumber ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
              }`}
            />
            {fieldErrors.mobileNumber && (
              <p className="text-[11px] text-rose-600">{fieldErrors.mobileNumber}</p>
            )}
          </div>
        </div>

        {/* WhatsApp Option */}
        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sameAsMobile}
              onChange={(e) => setSameAsMobile(e.target.checked)}
              className="rounded border-stone-300 text-brand-maroon focus:ring-brand-maroon"
            />
            <span>WhatsApp number is the same as mobile number</span>
          </label>

          {!sameAsMobile && (
            <div className="space-y-1 max-w-sm pt-1">
              <label className="text-xs font-bold text-brand-charcoal-900">
                WhatsApp Number
              </label>
              <input
                type="tel"
                maxLength={15}
                placeholder="e.g. 96895 41883"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
                  fieldErrors.whatsappNumber ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
                }`}
              />
              {fieldErrors.whatsappNumber && (
                <p className="text-[11px] text-rose-600">{fieldErrors.whatsappNumber}</p>
              )}
            </div>
          )}
        </div>

        {/* Email (Optional) */}
        <div className="space-y-1 max-w-sm">
          <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-brand-maroon" />
            Email Address (Optional)
          </label>
          <input
            type="email"
            placeholder="e.g. rajesh@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon ${
              fieldErrors.email ? "border-rose-400 bg-rose-50/20" : "border-stone-200"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-[11px] text-rose-600">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      {/* 5. SECTION 4: SPECIAL NOTES */}
      <div className="space-y-2 pt-4 border-t border-stone-200">
        <label className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-brand-maroon" />
          Additional Journey Requirements / Temple Stops (Optional)
        </label>
        <textarea
          rows={3}
          maxLength={1500}
          placeholder="Tell us anything else about your journey (e.g. senior citizens, wheelchair needs, large luggage, flight time, Kakad Aarti timings)..."
          value={additionalRequirements}
          onChange={(e) => setAdditionalRequirements(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon resize-y"
        />
      </div>

      {/* 6. Honest Disclaimers & Brand Trust */}
      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-1">
        <p>
          ℹ️{" "}
          <strong>
            {intent === "quote" ? "Quotation Notice:" : "Booking Confirmation Notice:"}
          </strong>{" "}
          {intent === "quote"
            ? "Final fare depends on the vehicle, travel dates, and exact route, and will be confirmed transparently by Ramesh Shep (Owner)."
            : "Submitting this request does not automatically confirm your vehicle. Our Shirdi team will contact you promptly to verify driver availability and details."}
        </p>
      </div>

      {/* 7. Submit Action */}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={isPending}
          className="w-full text-sm sm:text-base font-bold flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending Details to Shirdi Desk...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>
                {intent === "quote"
                  ? "Submit & Get Exact Quote"
                  : "Submit Booking Request"}
              </span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
