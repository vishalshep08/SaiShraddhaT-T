import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getDriversListAction, getVehiclesListAction } from "@/actions/bookingActions";
import { getCMSFleetCategoriesAction } from "@/actions/cmsActions";
import { getEnquiryDetailAction } from "@/actions/adminEnquiryActions";
import { BookingFormManager } from "@/components/admin/BookingFormManager";
import { VEHICLE_CATEGORIES, OWNED_FLEET_SUMMARY } from "@/data/fleetData";
import { BookingItem } from "@/types/booking";

export const dynamic = "force-dynamic";

interface NewBookingPageProps {
  searchParams: {
    enquiry_id?: string;
  };
}

export default async function AdminNewBookingPage({ searchParams }: NewBookingPageProps) {
  const driversList = await getDriversListAction({ activeOnly: true });
  const dbCategories = await getCMSFleetCategoriesAction();
  const dbVehicles = await getVehiclesListAction({ activeOnly: true });

  const vehicleCategories = dbCategories.length > 0
    ? dbCategories.map((c) => ({ id: c.id, name: c.name }))
    : VEHICLE_CATEGORIES.map((c) => ({ id: c.slug, name: c.name }));

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

  let initialBooking: Partial<BookingItem> = {
    id: "new",
    pickupLocation: "Sai Ashram (Bhakta Niwas 1000 Rooms), Shirdi",
    destination: "",
    travelDate: new Date().toISOString().split("T")[0],
    pickupTime: "06:30 AM",
    tripType: "one_way",
    passengerCount: 4,
    childrenCount: 0,
    vehicleCategoryName: "SUV / MUV (Ertiga / Tavera)",
    advanceReceived: 0,
    paymentStatus: "not_recorded",
    status: "confirmed",
    bookingSource: "phone",
  };

  // If prefilling from enquiry
  if (searchParams.enquiry_id) {
    const enquiry = await getEnquiryDetailAction(searchParams.enquiry_id);
    if (enquiry) {
      initialBooking = {
        ...initialBooking,
        enquiryId: enquiry.id,
        enquiryReference: enquiry.referenceNumber,
        customerName: enquiry.customerName,
        customerMobile: enquiry.mobileNumber,
        customerWhatsapp: enquiry.whatsappNumber || enquiry.mobileNumber,
        customerEmail: enquiry.email || undefined,
        pickupLocation: enquiry.pickupLocation || "Shirdi",
        destination: enquiry.destination || "",
        travelDate: enquiry.travelDate || new Date().toISOString().split("T")[0],
        returnDate: enquiry.returnDate || undefined,
        tripType: enquiry.tripType || "one_way",
        passengerCount: enquiry.passengerCount || 4,
        vehicleCategoryName: enquiry.vehiclePreferenceText || "SUV / MUV (Ertiga / Tavera)",
        journeyNotes: enquiry.additionalRequirements
          ? `[From Enquiry ${enquiry.referenceNumber}] ${enquiry.additionalRequirements}`
          : undefined,
        bookingSource: "website",
        status: "confirmed",
      };
    }
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
          <Link href="/admin/bookings" className="hover:text-brand-charcoal-900">
            Bookings
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-brand-charcoal-900">
            {searchParams.enquiry_id ? "Convert Enquiry to Booking" : "Create New Booking"}
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

      {searchParams.enquiry_id && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
          <span>
            Prefilled customer & trip details from enquiry <strong>{initialBooking.enquiryReference || searchParams.enquiry_id}</strong>. Review and save to confirm.
          </span>
          <Link
            href={`/admin/enquiries/${searchParams.enquiry_id}`}
            className="font-bold underline hover:text-blue-950 ml-2"
          >
            View Enquiry
          </Link>
        </div>
      )}

      <BookingFormManager
        initialData={initialBooking}
        driversList={defaultDrivers}
        vehicleCategories={vehicleCategories}
        ownedVehicles={ownedVehicles}
      />
    </div>
  );
}
