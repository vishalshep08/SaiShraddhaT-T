import React from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Calendar,
  Users,
} from "lucide-react";
import { getEnquiriesListAction } from "@/actions/adminEnquiryActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface EnquiriesPageProps {
  searchParams: {
    page?: string;
    status?: string;
    date?: string;
    search?: string;
    sort?: string;
  };
}

export default async function EnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const currentStatus = searchParams.status || "all";
  const currentDateFilter = searchParams.date || "all";
  const currentSearch = searchParams.search || "";
  const currentSort = searchParams.sort || "newest";
  const currentPage = Number(searchParams.page) || 1;

  const { enquiries, totalCount, page, totalPages } = await getEnquiriesListAction({
    page: currentPage,
    limit: 15,
    status: currentStatus,
    dateFilter: currentDateFilter,
    search: currentSearch,
    sortBy: currentSort,
  });

  const statusTabs = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "quote_discussed", label: "Quote Discussed" },
    { id: "follow_up", label: "Follow-up" },
    { id: "confirmed", label: "Confirmed" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
    { id: "lost", label: "Lost" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal-900 tracking-tight">
            Customer Enquiries & Leads
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage incoming quote requests, call customers, update journey statuses, and add private notes.
          </p>
        </div>
        <div className="text-xs font-bold text-brand-maroon bg-brand-maroon-50 px-3 py-1.5 rounded-lg border border-brand-maroon-100 self-start sm:self-auto">
          Total: {totalCount} Enquiries
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        {/* Search & Sort Form */}
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input type="hidden" name="status" value={currentStatus} />
          <input type="hidden" name="date" value={currentDateFilter} />

          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by customer name, mobile, destination, or ref code..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              name="sort"
              defaultValue={currentSort}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="travel_date">Sort: Travel Date</option>
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

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-stone-100 whitespace-nowrap">
          {statusTabs.map((tab) => {
            const isActive = currentStatus === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/enquiries?status=${tab.id}&date=${currentDateFilter}&search=${encodeURIComponent(
                  currentSearch
                )}&sort=${currentSort}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
      </div>

      {/* 3. Enquiries List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-brand-charcoal-900">
              No matching enquiries found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try resetting your search query or switching the status filter to "All".
            </p>
            <div className="pt-2">
              <Link
                href="/admin/enquiries"
                className="text-xs font-bold text-brand-maroon hover:underline"
              >
                Reset Filters
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
                    <th className="p-4">Route / Tour</th>
                    <th className="p-4">Travel Date</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {enquiries.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-maroon">
                        <Link href={`/admin/enquiries/${item.id}`} className="hover:underline">
                          {item.referenceNumber}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-brand-charcoal-900">
                          {item.customerName}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {item.mobileNumber}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-brand-charcoal-900">
                          {item.pickupLocation} → {item.destination}
                        </div>
                        <div className="text-[11px] text-stone-400 capitalize">
                          {item.tripType.replace("_", " ")}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap font-medium">
                        {item.travelDate ? (
                          new Intl.DateTimeFormat("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(item.travelDate))
                        ) : (
                          <span className="text-stone-400">Date TBD</span>
                        )}
                        <div className="text-[10px] text-stone-400">
                          {item.passengerCount} Passengers
                        </div>
                      </td>
                      <td className="p-4 text-xs text-stone-600 max-w-xs truncate">
                        {item.vehiclePreferenceText || "No preference"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                        <a
                          href={buildPhoneLink(item.mobileNumber)}
                          className="inline-flex p-1.5 rounded-lg bg-stone-100 text-brand-charcoal-900 hover:bg-brand-maroon hover:text-white transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={buildWhatsAppLink({
                            customMessage: `Hello ${item.customerName}, this is Sai Shraddha Tours & Travels, Shirdi regarding your enquiry (${item.referenceNumber}).`,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
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

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-stone-100">
              {enquiries.map((item) => (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-maroon">
                      {item.referenceNumber}
                    </span>
                    <StatusBadge status={item.status} />
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
                      🗓 {item.travelDate || "Date TBD"} ({item.passengerCount} Pax)
                    </span>
                    <span className="text-stone-400 truncate max-w-[120px]">
                      {item.vehiclePreferenceText}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={buildPhoneLink(item.mobileNumber)}
                      className="flex-1 py-2 rounded-lg bg-brand-maroon text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={buildWhatsAppLink({
                        customMessage: `Hello ${item.customerName}, this is Sai Shraddha Tours & Travels regarding your enquiry (${item.referenceNumber}).`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    <Link
                      href={`/admin/enquiries/${item.id}`}
                      className="px-3 py-2 rounded-lg bg-stone-100 text-brand-charcoal-900 text-xs font-bold"
                    >
                      Details
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
                  href={`/admin/enquiries?page=${page - 1}&status=${currentStatus}&date=${currentDateFilter}&search=${encodeURIComponent(
                    currentSearch
                  )}&sort=${currentSort}`}
                >
                  <Button size="sm" variant="outline" leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}>
                    Previous
                  </Button>
                </Link>
              )}

              {page < totalPages && (
                <Link
                  href={`/admin/enquiries?page=${page + 1}&status=${currentStatus}&date=${currentDateFilter}&search=${encodeURIComponent(
                    currentSearch
                  )}&sort=${currentSort}`}
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
