import React from "react";
import Link from "next/link";
import {
  Plus,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Edit,
  ShieldCheck,
} from "lucide-react";
import { getDriversListAction } from "@/actions/bookingActions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDriversPage() {
  const drivers = await getDriversListAction();

  const activeCount = drivers.filter((d) => d.isActive).length;
  const availableCount = drivers.filter((d) => d.status === "available" && d.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Driver Management
            </h1>
            <Badge variant="maroon" size="sm">
              {drivers.length} Registered
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage owner-driver (Ramesh Shep) and staff/partner drivers for booking assignments.
          </p>
        </div>

        <Link href="/admin/drivers/new">
          <Button variant="primary" size="md" className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Register Driver</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Drivers</p>
          <p className="text-xl font-extrabold text-brand-charcoal-900 mt-0.5">{drivers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Active / On Duty</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Available Now</p>
          <p className="text-xl font-extrabold text-brand-maroon mt-0.5">{availableCount}</p>
        </div>
      </div>

      {/* Drivers List */}
      {drivers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <User className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-sm font-bold text-stone-700">No drivers registered yet.</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Register your core drivers (e.g. Ramesh Shep, partner drivers) to assign them to customer bookings.
          </p>
          <Link href="/admin/drivers/new" className="inline-block pt-2">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Register Driver
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => {
            const cleanPhone = d.mobileNumber.replace(/\D/g, "");
            const whatsappUrl = cleanPhone
              ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                  `Namaste ${d.name}, message from Sai Shraddha Tours & Travels desk.`
                )}`
              : null;
            const phoneUrl = cleanPhone ? buildPhoneLink(d.mobileNumber) : null;

            return (
              <div
                key={d.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-charcoal-900 leading-tight">
                        {d.name}
                      </h3>
                      <p className="text-xs font-mono text-stone-500 mt-0.5">{d.mobileNumber}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        d.status === "available" && d.isActive
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : d.status === "on_trip"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}
                    >
                      {d.isActive ? d.status.replace("_", " ") : "Inactive"}
                    </span>
                  </div>

                  {d.alternateMobile && (
                    <p className="text-xs text-stone-500 font-mono">
                      Alt: {d.alternateMobile}
                    </p>
                  )}

                  {d.notes && (
                    <p className="text-xs text-stone-500 bg-stone-50 p-2 rounded-lg line-clamp-2">
                      {d.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {phoneUrl && (
                      <a
                        href={phoneUrl}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-brand-charcoal-900 transition-colors"
                        title="Call Driver"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="WhatsApp Driver"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <Link href={`/admin/drivers/${d.id}`}>
                    <Button variant="outline" size="sm" className="text-xs py-1 h-7 font-bold">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
