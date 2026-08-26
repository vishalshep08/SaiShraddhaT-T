"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Car,
  User,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCw,
  Printer,
  Search,
  Filter,
  ArrowRight,
  Wrench,
  AlertCircle,
  X,
  XCircle,
  Check,
} from "lucide-react";
import {
  DailyOperationsData,
  AssignmentFilterType,
  VehicleAvailabilityItem,
  DriverAvailabilityItem,
} from "@/types/operations";
import { BookingItem, BookingStatus } from "@/types/booking";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import {
  quickAssignTripAction,
  quickUpdateTripStatusAction,
  setVehicleMaintenanceAction,
} from "@/actions/operationsActions";
import { checkConflictsAction } from "@/actions/bookingActions";
import { buildWhatsAppLink, buildPhoneLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface DailyOperationsManagerProps {
  initialData: DailyOperationsData;
}

export function DailyOperationsManager({ initialData }: DailyOperationsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active view tab: "schedule" | "vehicles" | "drivers"
  const [activeTab, setActiveTab] = useState<"schedule" | "vehicles" | "drivers">("schedule");

  // Filter states
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilterType>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>("all");
  const [selectedDriverFilter, setSelectedDriverFilter] = useState<string>("all");

  // Last updated time tracker
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  // Quick Dispatch Modal State
  const [dispatchModalTrip, setDispatchModalTrip] = useState<BookingItem | null>(null);
  const [modalVehicleId, setModalVehicleId] = useState<string>("");
  const [modalDriverId, setModalDriverId] = useState<string>("");
  const [modalConflictWarning, setModalConflictWarning] = useState<string | null>(null);

  // Maintenance Toggle State
  const [maintenanceVehicle, setMaintenanceVehicle] = useState<VehicleAvailabilityItem | null>(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState<string>("");

  // Global message
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleDateNavigate = (daysOffset: number) => {
    try {
      const [y, m, d] = initialData.date.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setDate(dateObj.getDate() + daysOffset);
      const nextDateStr = dateObj.toISOString().split("T")[0];
      router.push(`/admin/operations?date=${nextDateStr}`);
    } catch {
      router.push("/admin/operations");
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      router.push(`/admin/operations?date=${e.target.value}`);
    }
  };

  const handleManualRefresh = () => {
    startTransition(() => {
      router.refresh();
      setLastUpdatedTime(
        new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    });
  };

  // Open Quick Dispatch Modal
  const openDispatchModal = async (trip: BookingItem) => {
    setDispatchModalTrip(trip);
    setModalVehicleId(trip.assignedVehicleId || "");
    setModalDriverId(trip.assignedDriverId || "");
    setModalConflictWarning(null);
  };

  // Check conflicts in modal when selections change
  const handleModalVehicleChange = async (vehicleId: string) => {
    setModalVehicleId(vehicleId);
    if (!dispatchModalTrip) return;

    if (vehicleId || modalDriverId) {
      const res = await checkConflictsAction({
        travelDate: dispatchModalTrip.travelDate,
        returnDate: dispatchModalTrip.returnDate,
        vehicleId: vehicleId || undefined,
        driverId: modalDriverId || undefined,
        excludeBookingId: dispatchModalTrip.id,
      });
      setModalConflictWarning(res.vehicleConflict || res.driverConflict || null);
    } else {
      setModalConflictWarning(null);
    }
  };

  const handleModalDriverChange = async (driverId: string) => {
    setModalDriverId(driverId);
    if (!dispatchModalTrip) return;

    if (modalVehicleId || driverId) {
      const res = await checkConflictsAction({
        travelDate: dispatchModalTrip.travelDate,
        returnDate: dispatchModalTrip.returnDate,
        vehicleId: modalVehicleId || undefined,
        driverId: driverId || undefined,
        excludeBookingId: dispatchModalTrip.id,
      });
      setModalConflictWarning(res.driverConflict || res.vehicleConflict || null);
    } else {
      setModalConflictWarning(null);
    }
  };

  const handleSaveDispatch = () => {
    if (!dispatchModalTrip) return;
    setActionMessage(null);

    startTransition(async () => {
      const res = await quickAssignTripAction({
        bookingId: dispatchModalTrip.id,
        vehicleId: modalVehicleId || undefined,
        driverId: modalDriverId || undefined,
        actorName: "Ramesh Shep",
      });

      if (res.success) {
        setActionMessage({
          type: "success",
          text: `Trip ${dispatchModalTrip.bookingReference} dispatch updated.`,
        });
        setDispatchModalTrip(null);
        router.refresh();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to update dispatch." });
      }
    });
  };

  const handleQuickStatus = (trip: BookingItem, newStatus: BookingStatus) => {
    setActionMessage(null);
    startTransition(async () => {
      const res = await quickUpdateTripStatusAction({
        bookingId: trip.id,
        newStatus,
        actorName: "Ramesh Shep",
      });

      if (res.success) {
        const label = newStatus === "in_progress" ? "started" : "completed";
        setActionMessage({
          type: "success",
          text: `Trip ${trip.bookingReference} marked as ${label}.`,
        });
        router.refresh();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to update status." });
      }
    });
  };

  const handleSaveMaintenance = () => {
    if (!maintenanceVehicle) return;
    setActionMessage(null);

    startTransition(async () => {
      const isCurrentlyMaintenance = maintenanceVehicle.availabilityStatus === "maintenance";
      const res = await setVehicleMaintenanceAction({
        vehicleId: maintenanceVehicle.vehicle.id,
        isMaintenance: !isCurrentlyMaintenance,
        notes: maintenanceNotes.trim() || undefined,
      });

      if (res.success) {
        setActionMessage({
          type: "success",
          text: `Vehicle status updated for ${maintenanceVehicle.vehicle.displayName || maintenanceVehicle.vehicle.name}.`,
        });
        setMaintenanceVehicle(null);
        router.refresh();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to update maintenance." });
      }
    });
  };

  // Filtered trips for active schedule view
  const filteredTrips = initialData.trips.filter((trip) => {
    if (assignmentFilter === "fully_assigned" && (!trip.assignedVehicleId || !trip.assignedDriverId)) {
      return false;
    }
    if (assignmentFilter === "vehicle_missing" && trip.assignedVehicleId) {
      return false;
    }
    if (assignmentFilter === "driver_missing" && trip.assignedDriverId) {
      return false;
    }
    if (assignmentFilter === "both_missing" && (trip.assignedVehicleId || trip.assignedDriverId)) {
      return false;
    }

    if (statusFilter !== "all" && trip.status !== statusFilter) {
      return false;
    }

    if (selectedVehicleFilter !== "all" && trip.assignedVehicleId !== selectedVehicleFilter) {
      return false;
    }

    if (selectedDriverFilter !== "all" && trip.assignedDriverId !== selectedDriverFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = trip.customerName.toLowerCase().includes(q);
      const matchMobile = trip.customerMobile.includes(q);
      const matchDest = trip.destination.toLowerCase().includes(q);
      const matchRef = trip.bookingReference.toLowerCase().includes(q);
      const matchDriver = trip.assignedDriverName?.toLowerCase().includes(q);
      const matchVehicle = trip.assignedVehicleName?.toLowerCase().includes(q);
      return matchName || matchMobile || matchDest || matchRef || matchDriver || matchVehicle;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
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

      {/* 1. Header & Date Control Center */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-brand-charcoal-900 tracking-tight">
                Daily Trip Operations
              </h1>
              {initialData.isToday ? (
                <Badge variant="maroon" size="sm">
                  TODAY
                </Badge>
              ) : initialData.isTomorrow ? (
                <Badge variant="saffron" size="sm">
                  TOMORROW
                </Badge>
              ) : (
                <Badge variant="gray" size="sm">
                  {initialData.date}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
              🗓 {initialData.formattedDate} • Sai Ashram Desk
            </p>
          </div>

          {/* Date Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDateNavigate(-1)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-brand-charcoal-900 transition-colors text-xs font-bold inline-flex items-center gap-1"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <Link href="/admin/operations">
              <button
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  initialData.isToday
                    ? "bg-brand-maroon text-white"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                }`}
              >
                Today
              </button>
            </Link>

            <button
              onClick={() => handleDateNavigate(1)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-brand-charcoal-900 transition-colors text-xs font-bold inline-flex items-center gap-1"
              title="Next Day"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Custom Date Input */}
            <div className="relative">
              <input
                type="date"
                value={initialData.date}
                onChange={handleCustomDateChange}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 text-stone-700 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
              />
            </div>

            {/* Print Schedule */}
            <Link
              href={`/admin/operations/print?date=${initialData.date}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition-colors shadow-xs"
              title="Print Clean Daily Schedule"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden md:inline">Print Schedule</span>
            </Link>

            {/* Refresh */}
            <button
              onClick={handleManualRefresh}
              disabled={isPending}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors text-xs"
              title={`Last updated at ${lastUpdatedTime}`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-brand-maroon" : ""}`} />
            </button>
          </div>
        </div>

        {/* 2. Top Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Metric 1: Total Trips */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Trips Scheduled
            </span>
            <span className="text-xl font-extrabold text-brand-charcoal-900 mt-0.5 block">
              {initialData.metrics.totalTrips}
            </span>
          </div>

          {/* Metric 2: Needs Vehicle */}
          <div
            className={`p-3.5 rounded-xl border ${
              initialData.metrics.unassignedVehiclesCount > 0
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-stone-50 border-stone-200/80 text-stone-700"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">
              Missing Vehicle
            </span>
            <span className="text-xl font-extrabold mt-0.5 block">
              {initialData.metrics.unassignedVehiclesCount}
            </span>
          </div>

          {/* Metric 3: Needs Driver */}
          <div
            className={`p-3.5 rounded-xl border ${
              initialData.metrics.unassignedDriversCount > 0
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-stone-50 border-stone-200/80 text-stone-700"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">
              Missing Driver
            </span>
            <span className="text-xl font-extrabold mt-0.5 block">
              {initialData.metrics.unassignedDriversCount}
            </span>
          </div>

          {/* Metric 4: Available Cabs */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-emerald-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Available Cabs
            </span>
            <span className="text-xl font-extrabold mt-0.5 block">
              {initialData.metrics.availableVehiclesCount}
            </span>
          </div>

          {/* Metric 5: Cabs On Trip */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-blue-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
              On Trip (Active)
            </span>
            <span className="text-xl font-extrabold mt-0.5 block">
              {initialData.metrics.inProgressCount || initialData.metrics.vehiclesOnTripCount}
            </span>
          </div>

          {/* Metric 6: Available Drivers */}
          <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 text-purple-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
              Ready Drivers
            </span>
            <span className="text-xl font-extrabold mt-0.5 block">
              {initialData.metrics.availableDriversCount}
            </span>
          </div>
        </div>
      </div>

      {/* 3. HIGH PRIORITY: Trips Needing Attention Callout */}
      {initialData.attentionTrips.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                Trips Needing Immediate Assignment ({initialData.attentionTrips.length})
              </h2>
            </div>
            <span className="text-xs text-amber-800 font-semibold hidden sm:inline">
              Assign owned Ertiga/Tavera or partner cab before trip departure.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {initialData.attentionTrips.map((trip) => {
              const missingVehicle = !trip.assignedVehicleId;
              const missingDriver = !trip.assignedDriverId;

              return (
                <div
                  key={trip.id}
                  className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-extrabold text-brand-maroon">
                        {trip.bookingReference}
                      </span>
                      <span className="text-stone-500 font-medium">
                        ⏰ {trip.pickupTime || "Time not specified"}
                      </span>
                    </div>

                    <p className="font-bold text-sm text-brand-charcoal-900">
                      {trip.customerName} ({trip.passengerCount} Pax)
                    </p>

                    <p className="text-xs text-stone-600 font-medium">
                      {trip.pickupLocation} → <strong className="text-brand-charcoal-900">{trip.destination}</strong>
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {missingVehicle && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          ⚠️ Vehicle Missing
                        </span>
                      )}
                      {missingDriver && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          ⚠️ Driver Missing
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <a
                      href={buildPhoneLink(trip.customerMobile)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-brand-charcoal-900 text-xs font-bold"
                      title="Call Customer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openDispatchModal(trip)}
                      className="text-xs font-bold py-1 h-7 flex-1"
                    >
                      Quick Assign
                    </Button>

                    <Link
                      href={`/admin/bookings/${trip.id}`}
                      className="text-xs font-semibold text-stone-600 hover:text-brand-maroon underline"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Navigation View Tabs (Schedule | Fleet | Drivers) */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
            activeTab === "schedule"
              ? "bg-brand-maroon text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Daily Schedule ({initialData.trips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
            activeTab === "vehicles"
              ? "bg-brand-maroon text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Fleet Availability ({initialData.vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("drivers")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
            activeTab === "drivers"
              ? "bg-brand-maroon text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Driver Availability ({initialData.drivers.length})</span>
        </button>
      </div>

      {/* 5. TAB VIEW 1: Daily Schedule List */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer, ref, route, driver..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                />
              </div>

              {/* Assignment Filter */}
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as AssignmentFilterType)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-50 font-semibold"
              >
                <option value="all">All Assignments</option>
                <option value="fully_assigned">Fully Assigned</option>
                <option value="vehicle_missing">Vehicle Missing</option>
                <option value="driver_missing">Driver Missing</option>
                <option value="both_missing">Both Missing</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-50 font-semibold capitalize"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <span className="text-[11px] text-stone-500 font-medium">
              Showing {filteredTrips.length} of {initialData.trips.length} trips
            </span>
          </div>

          {/* Schedule Table / Cards */}
          {filteredTrips.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
              <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-700">No trips found for this date.</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                No trips match the current filter or date. Check upcoming dates or create a booking.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => handleDateNavigate(1)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 text-xs font-bold text-stone-700 hover:bg-stone-200"
                >
                  Check Tomorrow
                </button>
                <Link href="/admin/bookings/new">
                  <Button size="sm" variant="primary">
                    Create Booking
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4 w-28">Time</th>
                      <th className="p-4">Customer & Route</th>
                      <th className="p-4">Assigned Vehicle</th>
                      <th className="p-4">Assigned Driver</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Dispatch Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {filteredTrips.map((trip) => {
                      const cleanPhone = trip.customerMobile.replace(/\D/g, "");
                      const whatsappUrl = cleanPhone
                        ? buildWhatsAppLink({
                            customMessage: `Namaste ${trip.customerName}, Sai Shraddha Tours & Travels confirming your trip on ${trip.travelDate} (${trip.bookingReference}).`,
                          })
                        : null;

                      return (
                        <tr key={trip.id} className="hover:bg-stone-50/80 transition-colors">
                          {/* Time */}
                          <td className="p-4 align-top">
                            <span className="font-bold text-xs text-brand-charcoal-900 block">
                              {trip.pickupTime || <span className="text-stone-400 italic">Not set</span>}
                            </span>
                            <span className="text-[10px] font-mono text-brand-maroon block font-bold mt-0.5">
                              {trip.bookingReference}
                            </span>
                          </td>

                          {/* Customer & Route */}
                          <td className="p-4 align-top">
                            <div className="font-bold text-brand-charcoal-900 text-sm">
                              {trip.customerName}
                              <span className="text-xs text-stone-500 font-normal ml-1.5">
                                ({trip.passengerCount} Pax)
                              </span>
                            </div>
                            <div className="font-semibold text-xs text-stone-700 mt-0.5">
                              {trip.pickupLocation} → <strong className="text-brand-charcoal-900">{trip.destination}</strong>
                            </div>
                            {trip.pickupNotes && (
                              <div className="text-[11px] text-stone-500 italic mt-0.5">
                                Note: {trip.pickupNotes}
                              </div>
                            )}
                          </td>

                          {/* Vehicle */}
                          <td className="p-4 align-top">
                            {trip.assignedVehicleName ? (
                              <div className="font-semibold text-brand-charcoal-900">
                                🚖 {trip.assignedVehicleName}
                              </div>
                            ) : (
                              <button
                                onClick={() => openDispatchModal(trip)}
                                className="px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 font-bold text-[11px] hover:bg-rose-100"
                              >
                                + Assign Cab
                              </button>
                            )}
                          </td>

                          {/* Driver */}
                          <td className="p-4 align-top">
                            {trip.assignedDriverName ? (
                              <div className="space-y-1">
                                <span className="font-semibold text-brand-charcoal-900 block">
                                  👤 {trip.assignedDriverName}
                                </span>
                                {trip.assignedDriverMobile && (
                                  <a
                                    href={buildPhoneLink(trip.assignedDriverMobile)}
                                    className="text-[11px] text-brand-maroon hover:underline font-mono"
                                  >
                                    📞 {trip.assignedDriverMobile}
                                  </a>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => openDispatchModal(trip)}
                                className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px] hover:bg-amber-100"
                              >
                                + Assign Driver
                              </button>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-4 align-top">
                            <BookingStatusBadge status={trip.status} />
                          </td>

                          {/* Actions */}
                          <td className="p-4 align-top text-right whitespace-nowrap space-x-1.5">
                            {/* Call Customer */}
                            <a
                              href={buildPhoneLink(trip.customerMobile)}
                              className="inline-flex p-1.5 rounded-lg bg-stone-100 hover:bg-brand-maroon hover:text-white transition-colors"
                              title="Call Customer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp Customer */}
                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                                title="WhatsApp Customer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Quick Start Trip */}
                            {(trip.status === "confirmed" || trip.status === "assigned") && (
                              <button
                                onClick={() => handleQuickStatus(trip, "in_progress")}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] inline-flex items-center gap-1"
                                title="Mark Trip Started"
                              >
                                <Play className="w-3 h-3" />
                                <span>Start</span>
                              </button>
                            )}

                            {/* Quick Complete Trip */}
                            {trip.status === "in_progress" && (
                              <button
                                onClick={() => handleQuickStatus(trip, "completed")}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] inline-flex items-center gap-1"
                                title="Mark Trip Completed"
                              >
                                <Check className="w-3 h-3" />
                                <span>Complete</span>
                              </button>
                            )}

                            {/* Manage Booking Details */}
                            <Link
                              href={`/admin/bookings/${trip.id}`}
                              className="inline-flex px-2.5 py-1 rounded-lg bg-stone-100 font-semibold hover:bg-stone-200 transition-colors text-[11px]"
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

              {/* Mobile Cards View */}
              <div className="lg:hidden space-y-3">
                {filteredTrips.map((trip) => {
                  const cleanPhone = trip.customerMobile.replace(/\D/g, "");
                  const whatsappUrl = cleanPhone
                    ? buildWhatsAppLink({
                        customMessage: `Namaste ${trip.customerName}, Sai Shraddha Tours & Travels confirming your trip on ${trip.travelDate} (${trip.bookingReference}).`,
                      })
                    : null;

                  return (
                    <div
                      key={trip.id}
                      className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-brand-charcoal-900">
                            ⏰ {trip.pickupTime || "Time not specified"}
                          </span>
                          <span className="text-[10px] font-mono text-brand-maroon font-bold">
                            {trip.bookingReference}
                          </span>
                        </div>
                        <BookingStatusBadge status={trip.status} />
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-sm text-brand-charcoal-900">
                          {trip.customerName} ({trip.passengerCount} Pax)
                        </p>
                        <p className="text-stone-700 font-semibold">
                          {trip.pickupLocation} → <strong className="text-brand-charcoal-900">{trip.destination}</strong>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-100">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400 block">Vehicle</span>
                          {trip.assignedVehicleName ? (
                            <span className="font-semibold text-stone-800">🚖 {trip.assignedVehicleName}</span>
                          ) : (
                            <button
                              onClick={() => openDispatchModal(trip)}
                              className="text-rose-700 font-bold underline text-[11px]"
                            >
                              + Assign Cab
                            </button>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400 block">Driver</span>
                          {trip.assignedDriverName ? (
                            <span className="font-semibold text-stone-800">👤 {trip.assignedDriverName}</span>
                          ) : (
                            <button
                              onClick={() => openDispatchModal(trip)}
                              className="text-amber-800 font-bold underline text-[11px]"
                            >
                              + Assign Driver
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1">
                          <a
                            href={buildPhoneLink(trip.customerMobile)}
                            className="p-2 rounded-lg bg-stone-100 text-brand-charcoal-900 text-xs font-bold"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          {whatsappUrl && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold"
                              title="WhatsApp Customer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {(trip.status === "confirmed" || trip.status === "assigned") && (
                            <button
                              onClick={() => handleQuickStatus(trip, "in_progress")}
                              disabled={isPending}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                            >
                              Start
                            </button>
                          )}

                          {trip.status === "in_progress" && (
                            <button
                              onClick={() => handleQuickStatus(trip, "completed")}
                              disabled={isPending}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs"
                            >
                              Complete
                            </button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDispatchModal(trip)}
                            className="text-xs font-bold py-1 h-7"
                          >
                            Dispatch
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recently Cancelled Section (if any) */}
          {initialData.cancelledTrips.length > 0 && (
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Cancelled / No-Show Trips for this Date ({initialData.cancelledTrips.length})
              </h3>
              <div className="divide-y divide-stone-200/60 text-xs">
                {initialData.cancelledTrips.map((c) => (
                  <div key={c.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-stone-500 mr-2">{c.bookingReference}</span>
                      <span className="font-semibold text-stone-700">{c.customerName}</span>
                      <span className="text-stone-400 ml-2">({c.pickupLocation} → {c.destination})</span>
                    </div>
                    <span className="capitalize text-stone-500 font-medium">
                      {c.status.replace("_", " ")} {c.cancellationReason ? `(${c.cancellationReason})` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB VIEW 2: Fleet Availability Grid */}
      {activeTab === "vehicles" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialData.vehicles.map((item) => {
              const v = item.vehicle;
              const isOwned = v.ownerType === "owned";

              const badgeColor =
                item.availabilityStatus === "available"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : item.availabilityStatus === "on_trip"
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : item.availabilityStatus === "assigned"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : item.availabilityStatus === "maintenance"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-stone-100 text-stone-600 border-stone-200";

              return (
                <div
                  key={v.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-brand-charcoal-900">
                          {v.displayName || v.name}
                        </h3>
                        <span className="text-[11px] text-stone-500 font-mono">
                          {v.registrationNumber || "Registration not added"}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${badgeColor}`}>
                        {item.availabilityStatus.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 pt-1">
                      <p>
                        <span className="text-stone-400">Ownership:</span>{" "}
                        <strong className="text-brand-charcoal-900">
                          {isOwned ? "Owned Fleet" : "Partner / External"}
                        </strong>{" "}
                        • {v.seatingCapacity} Pax
                      </p>

                      {item.statusReason && (
                        <p className="p-2 rounded bg-stone-50 text-[11px] text-stone-700">
                          {item.statusReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setMaintenanceVehicle(item);
                        setMaintenanceNotes(v.notes || "");
                      }}
                      className="text-xs font-semibold text-stone-600 hover:text-brand-maroon flex items-center gap-1"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{item.availabilityStatus === "maintenance" ? "End Maintenance" : "Maintenance"}</span>
                    </button>

                    <Link
                      href={`/admin/vehicles/${v.id}`}
                      className="text-xs font-bold text-brand-maroon hover:underline"
                    >
                      Edit Vehicle →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TAB VIEW 3: Driver Availability Grid */}
      {activeTab === "drivers" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialData.drivers.map((item) => {
              const d = item.driver;
              const cleanPhone = d.mobileNumber.replace(/\D/g, "");
              const whatsappUrl = cleanPhone
                ? buildWhatsAppLink({
                    customMessage: `Namaste ${d.name}, operational update from Sai Shraddha Tours & Travels for ${initialData.formattedDate}.`,
                  })
                : null;

              const badgeColor =
                item.availabilityStatus === "available"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : item.availabilityStatus === "on_trip"
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : item.availabilityStatus === "assigned"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-stone-100 text-stone-600 border-stone-200";

              return (
                <div
                  key={d.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-brand-charcoal-900">{d.name}</h3>
                        <span className="text-xs font-mono text-stone-500">{d.mobileNumber}</span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${badgeColor}`}>
                        {item.availabilityStatus.replace("_", " ")}
                      </span>
                    </div>

                    {item.statusReason && (
                      <p className="p-2 rounded bg-stone-50 text-[11px] text-stone-700">
                        {item.statusReason}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <a
                        href={buildPhoneLink(d.mobileNumber)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-brand-charcoal-900"
                        title="Call Driver"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                          title="WhatsApp Driver"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/admin/drivers/${d.id}`}
                      className="text-xs font-bold text-brand-maroon hover:underline"
                    >
                      Driver Profile →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Dispatch Modal */}
      {dispatchModalTrip && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-brand-charcoal-900">
                  Dispatch: {dispatchModalTrip.bookingReference}
                </h3>
                <p className="text-xs text-stone-500">
                  {dispatchModalTrip.customerName} • {dispatchModalTrip.pickupLocation} → {dispatchModalTrip.destination}
                </p>
              </div>
              <button
                onClick={() => setDispatchModalTrip(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conflict Warning */}
            {modalConflictWarning && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{modalConflictWarning}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800">Assign Vehicle</label>
                <select
                  value={modalVehicleId}
                  onChange={(e) => handleModalVehicleChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                >
                  <option value="">Vehicle Not Assigned</option>
                  {initialData.allVehiclesList
                    .filter((v) => v.isActive)
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.displayName || v.name} ({v.ownerType === "owned" ? "Owned" : "Partner"})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800">Assign Driver</label>
                <select
                  value={modalDriverId}
                  onChange={(e) => handleModalDriverChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white"
                >
                  <option value="">Driver Not Assigned</option>
                  {initialData.allDriversList
                    .filter((d) => d.isActive)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.mobileNumber})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button size="sm" variant="outline" onClick={() => setDispatchModalTrip(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={isPending}
                onClick={handleSaveDispatch}
                className="font-bold text-xs"
              >
                Save Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Toggle Modal */}
      {maintenanceVehicle && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-brand-charcoal-900">
              {maintenanceVehicle.availabilityStatus === "maintenance"
                ? `Return ${maintenanceVehicle.vehicle.displayName || maintenanceVehicle.vehicle.name} to Service?`
                : `Mark ${maintenanceVehicle.vehicle.displayName || maintenanceVehicle.vehicle.name} for Maintenance?`}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800">Maintenance Notes / Reason</label>
              <textarea
                rows={2}
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
                placeholder="e.g. Regular 10,000 km oil service, tyre alignment, AC cooling check..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setMaintenanceVehicle(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={isPending}
                onClick={handleSaveMaintenance}
                className="font-bold text-xs"
              >
                Confirm Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
