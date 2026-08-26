import React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  Car,
  User,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { getBookingsListAction, getDriversListAction } from "@/actions/bookingActions";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface BookingsPageProps {
  searchParams: {
    page?: string;
    status?: string;
    date?: string;
    search?: string;
    driver?: string;
  };
}

export default async function AdminBookingsPage({ searchParams }: BookingsPageProps) {
  const currentStatus = searchParams.status || "all";
  const currentDateFilter = searchParams.date || "all";
  const currentSearch = searchParams.search || "";
  const currentDriver = searchParams.driver || "all";
  const currentPage = Number(searchParams.page) || 1;

  const { bookings, totalCount, page, totalPages } = await getBookingsListAction({
    page: currentPage,
    limit: 15,
    status: currentStatus,
    dateFilter: currentDateFilter,
    search: currentSearch,
    driverId: currentDriver,
  });

  const drivers = await getDriversListAction();

  const dateTabs = [
    { id: "all", label: "All Dates" },
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past Trips" },
  ];

  const statusTabs = [
    { id: "all", label: "All Statuses" },
    { id: "confirmed", label: "Confirmed" },
    { id: "assigned", label: "Assigned" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Cab & Travel Bookings
            </h1>
            <Badge variant="maroon" size="sm">
              {totalCount} Total Bookings
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Operations & dispatch center: assign vehicles, assign drivers, check schedule conflicts, and track trip statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/bookings/new">
            <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create New Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input type="hidden" name="status" value={currentStatus} />
          <input type="hidden" name="date" value={currentDateFilter} />

          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by customer name, mobile, destination, or SSB reference..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              name="driver"
              defaultValue={currentDriver}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            >
              <option value="all">Filter: All Drivers</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  Driver: {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full h-full py-2 px-3 rounded-xl bg-brand-maroon text-white font-bold text-xs hover:bg-brand-maroon-800 transition-colors"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Date Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-stone-100 whitespace-nowrap">
          <span className="text-[11px] font-bold text-stone-400 mr-1">Date:</span>
          {dateTabs.map((tab) => {
            const isActive = currentDateFilter === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/bookings?status=${currentStatus}&date=${tab.id}&search=${encodeURIComponent(
                  currentSearch
                )}&driver=${currentDriver}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-charcoal-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 whitespace-nowrap">
          <span className="text-[11px] font-bold text-stone-400 mr-1">Status:</span>
          {statusTabs.map((tab) => {
            const isActive = currentStatus === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/bookings?status=${tab.id}&date=${currentDateFilter}&search=${encodeURIComponent(
                  currentSearch
                )}&driver=${currentDriver}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-maroon text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Bookings List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-brand-charcoal-900">
              No bookings found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No trips match your current filter criteria. Create a manual booking or convert incoming customer enquiries.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/bookings"
                className="text-xs font-bold text-brand-maroon hover:underline"
              >
                Reset All Filters
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Route & Date</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {bookings.map((item) => {
                    const isUnassigned = item.status === "confirmed" && (!item.assignedDriverId || !item.assignedVehicleId);
                    return (
                      <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-brand-maroon">
                          <Link href={`/admin/bookings/${item.id}`} className="hover:underline">
                            {item.bookingReference}
                          </Link>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-brand-charcoal-900">
                            {item.customerName}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono">
                            {item.customerMobile}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-brand-charcoal-900">
                            {item.pickupLocation} → {item.destination}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            🗓 {item.travelDate} {item.pickupTime ? `• ${item.pickupTime}` : ""} ({item.passengerCount} Pax)
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-stone-800">
                            {item.assignedVehicleName || item.vehicleCategoryName || "SUV / MUV"}
                          </div>
                          {!item.assignedVehicleName && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                              Vehicle not assigned
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {item.assignedDriverName ? (
                            <div>
                              <div className="font-medium text-stone-900">{item.assignedDriverName}</div>
                              {item.assignedDriverMobile && (
                                <a
                                  href={buildPhoneLink(item.assignedDriverMobile)}
                                  className="text-[10px] text-stone-500 hover:underline font-mono"
                                >
                                  {item.assignedDriverMobile}
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-semibold">
                              Driver not assigned
                            </span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <BookingStatusBadge status={item.status} />
                        </td>
                        <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                          <a
                            href={buildPhoneLink(item.customerMobile)}
                            className="inline-flex p-1.5 rounded-lg bg-stone-100 text-brand-charcoal-900 hover:bg-brand-maroon hover:text-white transition-colors"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={buildWhatsAppLink({
                              customMessage: `Hello ${item.customerName}, this is Sai Shraddha Tours & Travels regarding your booking (${item.bookingReference}) for ${item.pickupLocation} to ${item.destination} on ${item.travelDate}.`,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="WhatsApp Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href={`/admin/bookings/${item.id}`}
                            className="inline-flex px-2.5 py-1 rounded-lg bg-stone-100 font-semibold hover:bg-brand-maroon hover:text-white transition-colors text-[11px]"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-stone-100">
              {bookings.map((item) => (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-maroon">
                      {item.bookingReference}
                    </span>
                    <BookingStatusBadge status={item.status} />
                  </div>

                  <div>
                    <div className="font-bold text-sm text-brand-charcoal-900">
                      {item.customerName}
                    </div>
                    <div className="text-xs text-stone-600 font-medium mt-0.5">
                      📍 {item.pickupLocation} → {item.destination}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                    <span>
                      🗓 {item.travelDate} {item.pickupTime ? `• ${item.pickupTime}` : ""}
                    </span>
                    <span>
                      🚗 {item.assignedVehicleName || item.vehicleCategoryName || "SUV"}
                    </span>
                  </div>

                  {/* Driver allocation status */}
                  <div className="text-xs text-stone-600 pt-0.5 flex items-center justify-between">
                    <span>
                      Driver: <strong>{item.assignedDriverName || "Not assigned"}</strong>
                    </span>
                    {item.finalFare && (
                      <span className="font-bold text-brand-charcoal-900">
                        ₹{item.finalFare}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={buildPhoneLink(item.customerMobile)}
                      className="flex-1 py-2 rounded-lg bg-brand-maroon text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Customer
                    </a>
                    {item.assignedDriverMobile && (
                      <a
                        href={buildPhoneLink(item.assignedDriverMobile)}
                        className="py-2 px-3 rounded-lg bg-stone-100 text-brand-charcoal-900 text-xs font-bold flex items-center gap-1"
                        title="Call Driver"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-500" /> Driver
                      </a>
                    )}
                    <Link
                      href={`/admin/bookings/${item.id}`}
                      className="px-3 py-2 rounded-lg bg-stone-100 text-brand-charcoal-900 text-xs font-bold"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
            <div className="text-stone-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total)
            </div>

            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/bookings?page=${page - 1}&status=${currentStatus}&date=${currentDateFilter}&search=${encodeURIComponent(
                    currentSearch
                  )}&driver=${currentDriver}`}
                >
                  <Button size="sm" variant="outline" leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}>
                    Previous
                  </Button>
                </Link>
              )}

              {page < totalPages && (
                <Link
                  href={`/admin/bookings?page=${page + 1}&status=${currentStatus}&date=${currentDateFilter}&search=${encodeURIComponent(
                    currentSearch
                  )}&driver=${currentDriver}`}
                >
                  <Button size="sm" variant="outline" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
