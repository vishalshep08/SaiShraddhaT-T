import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getBookingDetailAction, getDriversListAction, getVehiclesListAction } from "@/actions/bookingActions";
import { BookingDetailManager } from "@/components/admin/BookingDetailManager";

export const dynamic = "force-dynamic";

interface AdminBookingDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminBookingDetailPage({
  params,
}: AdminBookingDetailPageProps) {
  const booking = await getBookingDetailAction(params.id);

  if (!booking) {
    notFound();
  }

  const driversList = await getDriversListAction({ activeOnly: true });
  const dbVehicles = await getVehiclesListAction({ activeOnly: true });

  const defaultDrivers = driversList.length > 0
    ? driversList
    : [
        {
          id: "driver-ramesh",
          name: "Ramesh Shep (Owner)",
          mobileNumber: "9890073081",
          status: "active" as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

  const ownedVehicles = dbVehicles.length > 0
    ? dbVehicles.map((v) => ({
        id: v.id,
        name: v.displayName || `${v.name}${v.registrationNumber ? ` (${v.registrationNumber})` : ""}`,
      }))
    : [
        { id: "ertiga-01", name: "Maruti Suzuki Ertiga (Vehicle 01 - 6+1 Pax)" },
        { id: "ertiga-02", name: "Maruti Suzuki Ertiga (Vehicle 02 - 6+1 Pax)" },
        { id: "ertiga-03", name: "Maruti Suzuki Ertiga (Vehicle 03 - 6+1 Pax)" },
        { id: "tavera-01", name: "Chevrolet Tavera (Vehicle 01 - 7/8+1 Pax)" },
      ];

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
          <Link href="/admin/bookings" className="hover:text-brand-charcoal-900">
            Bookings
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {booking.bookingReference}
          </span>
        </nav>

        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bookings</span>
        </Link>
      </div>

      <BookingDetailManager
        booking={booking}
        driversList={defaultDrivers}
        ownedVehicles={ownedVehicles}
      />
    </div>
  );
}
