import React from "react";
import Link from "next/link";
import {
  Inbox,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowRight,
  MapPin,
  Users,
  Car,
  ShieldCheck,
  CalendarCheck2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { getAdminSession } from "@/actions/authActions";
import { getDashboardMetricsAction } from "@/actions/adminEnquiryActions";
import { getBookingsListAction, getOperationalDashboardAction } from "@/actions/bookingActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getAdminSession();
  const metrics = await getDashboardMetricsAction();
  const operational = await getOperationalDashboardAction();
  const todayBookingsRes = await getBookingsListAction({ dateFilter: "today", limit: 5 });
  const unassignedBookingsRes = await getBookingsListAction({ status: "confirmed", limit: 5 });
  const recentBookingsRes = await getBookingsListAction({ limit: 5 });

  const formattedToday = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Operational Dashboard
            </h1>
            <Badge variant="maroon" size="sm">
              Shirdi Desk
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Namaste {user?.name || "Ramesh Shep"} • {formattedToday}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/operations">
            <Button size="sm" variant="primary" leftIcon={<Clock className="w-4 h-4" />}>
              Daily Operations
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button size="sm" variant="outline" leftIcon={<TrendingUp className="w-4 h-4" />}>
              Analytics
            </Button>
          </Link>
          <Link href="/admin/bookings/new">
            <Button size="sm" variant="outline" leftIcon={<CalendarCheck2 className="w-4 h-4" />}>
              Create Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Four Operational Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Today's Trips */}
        <Link
          href="/admin/operations"
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-brand-maroon/50 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Today's Trips
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-maroon-50 text-brand-maroon flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-charcoal-900">
              {todayBookingsRes.totalCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">scheduled</span>
          </div>
          <span className="text-[11px] font-semibold text-brand-maroon mt-2 flex items-center gap-1 group-hover:underline">
            View Daily Operations <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Card 2: Unassigned Confirmed Trips */}
        <Link
          href="/admin/bookings?status=confirmed"
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-500/50 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Needs Assignment
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">
              {unassignedBookingsRes.totalCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">unassigned</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 mt-2 flex items-center gap-1 group-hover:underline">
            Assign Driver / Cab <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Card 3: New Enquiries */}
        <Link
          href="/admin/enquiries?status=new"
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-blue-500/50 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              New Enquiries
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600">
              {metrics.newEnquiriesCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">pending contact</span>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 mt-2 flex items-center gap-1 group-hover:underline">
            Review Leads <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Card 4: Total Bookings */}
        <Link
          href="/admin/bookings"
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500/50 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-charcoal-900">
              {recentBookingsRes.totalCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">total logged</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 mt-2 flex items-center gap-1 group-hover:underline">
            All Bookings <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Operational Alert: Today's Active Trips & Unassigned Warnings */}
      {operational.todayTrips.length > 0 && (
        <div className="bg-brand-maroon-50/60 rounded-2xl border border-brand-maroon/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon animate-pulse" />
              <h2 className="text-sm font-bold text-brand-maroon uppercase tracking-wider">
                Today's Trip Dispatch ({operational.todayTrips.length} Active Today)
              </h2>
            </div>
            <Link
              href="/admin/bookings?date=today"
              className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1"
            >
              <span>Manage Today</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {operational.todayTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white p-4 rounded-xl border border-brand-maroon/10 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-brand-maroon">
                    {trip.bookingReference}
                  </span>
                  <BookingStatusBadge status={trip.status} />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-brand-charcoal-900 block">{trip.customerName}</span>
                  <span className="text-stone-600">
                    {trip.pickupLocation} → {trip.destination}
                  </span>
                  {trip.pickupTime && (
                    <span className="block text-stone-500 font-medium mt-0.5">
                      ⏰ Pickup: {trip.pickupTime}
                    </span>
                  )}
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-600">
                    🚖 {trip.assignedVehicleName || <span className="text-amber-700 font-bold">No Cab</span>}
                  </span>
                  <Link
                    href={`/admin/bookings/${trip.id}`}
                    className="font-bold text-brand-maroon hover:underline"
                  >
                    Open →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Section: Recent Bookings Dispatch List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-charcoal-900">
              Recent Cab & Travel Bookings
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Live operational dispatch status and driver assignments.
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookingsRes.bookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No bookings recorded yet. Create a booking manually or convert a customer enquiry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Route & Date</th>
                  <th className="p-4">Driver</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {recentBookingsRes.bookings.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-maroon">
                      <Link href={`/admin/bookings/${item.id}`} className="hover:underline">
                        {item.bookingReference}
                      </Link>
                    </td>
                    <td className="p-4 font-bold text-brand-charcoal-900">
                      {item.customerName}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-brand-charcoal-900">
                        {item.pickupLocation} → {item.destination}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        🗓 {item.travelDate} ({item.passengerCount} Pax)
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      {item.assignedDriverName || (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="p-4">
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
                      <Link
                        href={`/admin/bookings/${item.id}`}
                        className="inline-flex px-2.5 py-1 rounded-lg bg-stone-100 font-semibold hover:bg-brand-maroon hover:text-white transition-colors text-[11px]"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Section: Recent Customer Enquiries */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-charcoal-900">
              Recent Customer Enquiries
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Incoming website leads awaiting phone/WhatsApp confirmation.
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metrics.recentEnquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No customer enquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Ref #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {metrics.recentEnquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-maroon">
                      <Link href={`/admin/enquiries/${item.id}`} className="hover:underline">
                        {item.referenceNumber}
                      </Link>
                    </td>
                    <td className="p-4 font-bold text-brand-charcoal-900">
                      {item.customerName}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-brand-charcoal-900">
                        {item.pickupLocation} → {item.destination}
                      </div>
                    </td>
                    <td className="p-4 font-medium whitespace-nowrap">
                      {item.travelDate || "TBD"}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      <Link
                        href={`/admin/bookings/new?enquiry_id=${item.id}`}
                        className="inline-flex px-2 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold hover:bg-brand-charcoal-900 hover:text-white transition-colors text-[10px]"
                        title="Convert to Booking"
                      >
                        + Book
                      </Link>
                      <Link
                        href={`/admin/enquiries/${item.id}`}
                        className="inline-flex px-2.5 py-1 rounded-lg bg-stone-100 font-semibold hover:bg-brand-maroon hover:text-white transition-colors text-[11px]"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
