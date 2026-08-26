import React from "react";
import { notFound } from "next/navigation";
import { getBookingDetailAction } from "@/actions/bookingActions";

export const dynamic = "force-dynamic";

interface PrintBookingPageProps {
  params: { id: string };
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default async function PrintBookingPage({ params }: PrintBookingPageProps) {
  const booking = await getBookingDetailAction(params.id);
  if (!booking) notFound();

  const isMultiDay = Boolean(booking.returnDate);
  const tripTypeLabel =
    booking.tripType === "round_trip"
      ? "Round Trip"
      : booking.tripType === "multi_day"
      ? "Multi-Day Journey"
      : "One Way";

  return (
    <>
      {/* Print-only styles injected via style tag */}
      <style>{`
        @media print {
          @page { margin: 15mm 15mm 15mm 15mm; size: A4; }
          body { font-size: 13px !important; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
        body { font-family: 'Segoe UI', system-ui, sans-serif; }
      `}</style>

      {/* Screen toolbar */}
      <div className="no-print bg-stone-100 border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <a
          href={`/admin/bookings/${booking.id}`}
          className="text-xs font-semibold text-brand-maroon hover:underline"
        >
          ← Back to Booking
        </a>
        <button
          onClick={() => window.print()}
          className="px-4 py-1.5 rounded-lg bg-brand-charcoal-900 text-white text-xs font-bold"
        >
          Print / Save PDF
        </button>
      </div>

      {/* Printable booking summary */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6 text-brand-charcoal-900">

        {/* Business Header */}
        <div className="text-center border-b-2 border-stone-800 pb-4 space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight uppercase">
            Sai Shraddha Tours &amp; Travels
          </h1>
          <p className="text-xs text-stone-600">
            Sai Ashram (Bhakta Niwas), Pimpalwadi Road, Shirdi — 423 109, Maharashtra
          </p>
          <p className="text-xs text-stone-600">
            Ramesh Shep (Owner): +91 98900 73081
          </p>
          <p className="text-[11px] text-stone-400 uppercase tracking-widest pt-1">
            Established 2014 — Sai Ashram Desk
          </p>
        </div>

        {/* Booking Reference */}
        <div className="flex items-center justify-between border border-stone-300 rounded-lg px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Booking Reference</p>
            <p className="text-lg font-extrabold tracking-wide text-brand-maroon">{booking.bookingReference}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</p>
            <p className="text-sm font-bold capitalize">{booking.status.replace("_", " ")}</p>
          </div>
        </div>

        {/* Customer Section */}
        <div className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
            Customer
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="font-semibold">Name:</span>{" "}
              <span>{booking.customerName}</span>
            </div>
            <div>
              <span className="font-semibold">Mobile:</span>{" "}
              <span>{booking.customerMobile}</span>
            </div>
            {booking.customerEmail && (
              <div className="col-span-2">
                <span className="font-semibold">Email:</span>{" "}
                <span>{booking.customerEmail}</span>
              </div>
            )}
            <div>
              <span className="font-semibold">Passengers:</span>{" "}
              <span>
                {booking.passengerCount} Adults
                {booking.childrenCount ? ` + ${booking.childrenCount} Children` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
            Journey Details
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="font-semibold">Pickup:</span>{" "}
              <span>{booking.pickupLocation}</span>
            </div>
            <div>
              <span className="font-semibold">Destination:</span>{" "}
              <span>{booking.destination}</span>
            </div>
            {booking.pickupLandmark && (
              <div>
                <span className="font-semibold">Pickup Point:</span>{" "}
                <span className="text-xs">{booking.pickupLandmark}</span>
              </div>
            )}
            {booking.pickupNotes && (
              <div>
                <span className="font-semibold">Pickup Notes:</span>{" "}
                <span className="text-xs">{booking.pickupNotes}</span>
              </div>
            )}
            <div>
              <span className="font-semibold">Travel Date:</span>{" "}
              <span className="font-bold">{formatDate(booking.travelDate)}</span>
            </div>
            {booking.pickupTime && (
              <div>
                <span className="font-semibold">Pickup Time:</span>{" "}
                <span>{booking.pickupTime}</span>
              </div>
            )}
            {isMultiDay && (
              <div>
                <span className="font-semibold">Return Date:</span>{" "}
                <span className="font-bold">{formatDate(booking.returnDate)}</span>
              </div>
            )}
            <div>
              <span className="font-semibold">Trip Type:</span>{" "}
              <span>{tripTypeLabel}</span>
            </div>
          </div>

          {/* Multi-stop itinerary */}
          {(booking.journeyDescription || (booking.stops && booking.stops.length > 0)) && (
            <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded text-xs space-y-1">
              <p className="font-bold text-stone-600">Journey Itinerary:</p>
              {booking.journeyDescription && (
                <p className="whitespace-pre-wrap">{booking.journeyDescription}</p>
              )}
              {booking.stops && booking.stops.length > 0 && (
                <ol className="list-decimal list-inside space-y-0.5">
                  {booking.stops.map((stop) => (
                    <li key={stop.id}>
                      {stop.location}
                      {stop.landmark ? ` — ${stop.landmark}` : ""}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>

        {/* Vehicle & Driver */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
              Vehicle
            </h2>
            <p className="text-sm font-semibold">
              {booking.assignedVehicleName || "—"}
            </p>
            {booking.vehicleCategoryName && (
              <p className="text-xs text-stone-500">{booking.vehicleCategoryName}</p>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
              Driver
            </h2>
            <p className="text-sm font-semibold">
              {booking.assignedDriverName || "—"}
            </p>
            {booking.assignedDriverMobile && (
              <p className="text-xs text-stone-500">{booking.assignedDriverMobile}</p>
            )}
          </div>
        </div>

        {/* Customer Notes */}
        {(booking.customerRequirements || booking.journeyNotes) && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
              Customer Notes
            </h2>
            <p className="text-xs text-stone-700 whitespace-pre-wrap">
              {booking.customerRequirements || booking.journeyNotes}
            </p>
          </div>
        )}

        {/* Fare (optional, only if recorded) */}
        {booking.quotedFare != null && (
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1">
              Fare (Internal Record)
            </h2>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-[10px] text-stone-400">Quoted</p>
                <p className="font-bold">₹{booking.quotedFare.toLocaleString("en-IN")}</p>
              </div>
              {booking.advanceReceived != null && booking.advanceReceived > 0 && (
                <div>
                  <p className="text-[10px] text-stone-400">Advance Received</p>
                  <p className="font-bold">₹{booking.advanceReceived.toLocaleString("en-IN")}</p>
                </div>
              )}
              {booking.balanceAmount != null && booking.balanceAmount > 0 && (
                <div>
                  <p className="text-[10px] text-stone-400">Balance Due</p>
                  <p className="font-bold text-rose-700">₹{booking.balanceAmount.toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-stone-200 pt-4 text-center text-[10px] text-stone-400 space-y-1">
          <p>
            This is an internal trip summary for Sai Shraddha Tours &amp; Travels operational use.
          </p>
          <p>
            Printed: {new Intl.DateTimeFormat("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date())}
          </p>
        </div>
      </div>
    </>
  );
}
