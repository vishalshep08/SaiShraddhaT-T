"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DailyOperationsData,
  DailyOperationsFilter,
  OperationalSummaryMetrics,
  VehicleAvailabilityItem,
  DriverAvailabilityItem,
} from "@/types/operations";
import { BookingItem, BookingStatus, DriverItem, VehicleItem } from "@/types/booking";
import { getDriversListAction, getVehiclesListAction } from "@/actions/bookingActions";
import { revalidatePath } from "next/cache";

/**
 * Returns current date string in YYYY-MM-DD formatted for Asia/Kolkata timezone
 */
export async function getKolkataDateString(offsetDays: number = 0): Promise<string> {
  const now = new Date();
  if (offsetDays !== 0) {
    now.setDate(now.getDate() + offsetDays);
  }
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Formats YYYY-MM-DD into "Wednesday, 26 August 2026"
 */
function formatKolkataDisplayDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Parses time strings like "8:30 AM", "06:00 AM", "2:00 PM", "14:30", "Morning" into minutes from midnight
 * for precise chronological sorting
 */
function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr || !timeStr.trim()) return 99999; // No time -> bottom

  const clean = timeStr.trim().toLowerCase();

  // Natural words
  if (clean.includes("early morning") || clean === "morning") return 7 * 60; // 07:00
  if (clean === "afternoon" || clean.includes("noon")) return 13 * 60; // 13:00
  if (clean === "evening") return 18 * 60; // 18:00
  if (clean === "night") return 21 * 60; // 21:00

  // 12-hour AM/PM format (e.g., "8:30 AM", "06:00 am")
  const ampmMatch = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPM = ampmMatch[3] === "pm";

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // 24-hour format (e.g. "14:30", "08:00")
  const h24Match = clean.match(/(\d{1,2}):(\d{2})/);
  if (h24Match) {
    const hours = parseInt(h24Match[1], 10);
    const minutes = parseInt(h24Match[2], 10);
    return hours * 60 + minutes;
  }

  return 99999;
}

function mapBookingRow(row: any): BookingItem {
  const finalFare = row.final_fare != null ? Number(row.final_fare) : undefined;
  const advance = row.advance_received != null ? Number(row.advance_received) : 0;
  const balance = finalFare != null ? Math.max(0, finalFare - advance) : undefined;

  return {
    id: row.id,
    bookingReference: row.booking_reference || `SSB-${row.id.slice(0, 8).toUpperCase()}`,
    enquiryId: row.enquiry_id || undefined,
    customerName: row.customer_name || "Guest Customer",
    customerMobile: row.customer_mobile || "",
    customerWhatsapp: row.customer_whatsapp || undefined,
    customerEmail: row.customer_email || undefined,
    pickupLocation: row.pickup_location || "Shirdi",
    pickupLandmark: row.pickup_landmark || undefined,
    pickupNotes: row.pickup_notes || undefined,
    destination: row.destination || "Not specified",
    destinationLandmark: row.destination_landmark || undefined,
    dropNotes: row.drop_notes || undefined,
    travelDate: row.travel_date || new Date().toISOString().split("T")[0],
    pickupTime: row.pickup_time || undefined,
    returnDate: row.return_date || undefined,
    returnPickupTime: row.return_pickup_time || undefined,
    tripType: row.trip_type || "one_way",
    passengerCount: row.passenger_count || 1,
    childrenCount: row.children_count || 0,
    vehicleCategoryId: row.vehicle_category_id || undefined,
    vehicleCategoryName: row.vehicle_category_name || "SUV / MUV (Ertiga / Tavera)",
    assignedVehicleId: row.assigned_vehicle_id || undefined,
    assignedVehicleName: row.assigned_vehicle_name || undefined,
    assignedDriverId: row.assigned_driver_id || undefined,
    assignedDriverName: row.assigned_driver_name || undefined,
    assignedDriverMobile: row.assigned_driver_mobile || undefined,
    quotedFare: row.quoted_fare != null ? Number(row.quoted_fare) : undefined,
    finalFare,
    advanceReceived: advance,
    balanceAmount: balance,
    paymentStatus: row.payment_status || "not_recorded",
    paymentMethod: row.payment_method || undefined,
    status: (row.status as BookingStatus) || "confirmed",
    journeyNotes: row.journey_notes || undefined,
    journeyDescription: row.journey_description || row.journey_notes || undefined,
    customerRequirements: row.customer_requirements || row.customer_notes || undefined,
    internalAdminNotes: row.internal_admin_notes || undefined,
    cancellationReason: row.cancellation_reason || undefined,
    bookingSource: row.booking_source || "website",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Main Daily Operations Data Action
 * Fetches all trips for a specific date (handling single and multi-day spans),
 * computes real-time fleet and driver availability, and calculates operational metrics.
 */
export async function getDailyOperationsAction(
  dateParam?: string,
  filter?: DailyOperationsFilter
): Promise<DailyOperationsData> {
  try {
    const todayStr = await getKolkataDateString(0);
    const tomorrowStr = await getKolkataDateString(1);
    const targetDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : todayStr;

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return {
        date: targetDate,
        formattedDate: formatKolkataDisplayDate(targetDate),
        isToday: targetDate === todayStr,
        isTomorrow: targetDate === tomorrowStr,
        metrics: {
          totalTrips: 0,
          unassignedVehiclesCount: 0,
          unassignedDriversCount: 0,
          availableVehiclesCount: 0,
          vehiclesOnTripCount: 0,
          vehiclesMaintenanceCount: 0,
          availableDriversCount: 0,
          inProgressCount: 0,
          completedCount: 0,
        },
        trips: [],
        attentionTrips: [],
        cancelledTrips: [],
        vehicles: [],
        drivers: [],
        allDriversList: [],
        allVehiclesList: [],
      };
    }

    // Fetch bookings that cover targetDate (single-day on targetDate OR multi-day spanning targetDate)
    const { data: bookingsData, error: bookingsError } = await (supabase.from("bookings") as any)
      .select("*")
      .or(`travel_date.eq.${targetDate},and(travel_date.lte.${targetDate},return_date.gte.${targetDate})`)
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("[Operations Bookings Query Error]:", bookingsError);
    }

    const allRawBookings = (bookingsData || []).map(mapBookingRow);

    // Sort chronologically by pickup time (earliest morning first)
    const sortedBookings = [...allRawBookings].sort((a, b) => {
      const timeA = parseTimeToMinutes(a.pickupTime);
      const timeB = parseTimeToMinutes(b.pickupTime);
      return timeA - timeB;
    });

    // Separate active trips vs cancelled trips
    const activeTrips = sortedBookings.filter(
      (b) => b.status !== "cancelled" && b.status !== "no_show"
    );
    const cancelledTrips = sortedBookings.filter(
      (b) => b.status === "cancelled" || b.status === "no_show"
    );

    // Filter trips needing attention (confirmed/draft trips missing vehicle, driver, or both)
    const attentionTrips = activeTrips.filter(
      (b) =>
        b.status !== "completed" &&
        (!b.assignedVehicleId || !b.assignedDriverId)
    );

    // Fetch registered vehicles and drivers
    const [allVehiclesList, allDriversList] = await Promise.all([
      getVehiclesListAction(),
      getDriversListAction(),
    ]);

    // Compute Live Fleet Availability for targetDate
    const vehicleAvailability: VehicleAvailabilityItem[] = allVehiclesList.map((v) => {
      const assignedTrips = activeTrips.filter((b) => b.assignedVehicleId === v.id);
      const onTrip = assignedTrips.find((b) => b.status === "in_progress");

      let availabilityStatus: "available" | "assigned" | "on_trip" | "maintenance" | "inactive" = "available";
      let statusReason: string | undefined = undefined;

      if (!v.isActive || v.status === "inactive") {
        availabilityStatus = "inactive";
        statusReason = "Marked inactive in fleet settings";
      } else if (v.status === "maintenance") {
        availabilityStatus = "maintenance";
        statusReason = v.notes || "Under maintenance";
      } else if (onTrip) {
        availabilityStatus = "on_trip";
        statusReason = `On trip to ${onTrip.destination} (${onTrip.bookingReference})`;
      } else if (assignedTrips.length > 0) {
        availabilityStatus = "assigned";
        statusReason = `Assigned to ${assignedTrips[0].destination} (${assignedTrips[0].bookingReference})`;
      }

      return {
        vehicle: v,
        availabilityStatus,
        statusReason,
        currentTrip: onTrip || assignedTrips[0] || undefined,
        dayTrips: assignedTrips,
      };
    });

    // Compute Live Driver Availability for targetDate
    const driverAvailability: DriverAvailabilityItem[] = allDriversList.map((d) => {
      const assignedTrips = activeTrips.filter((b) => b.assignedDriverId === d.id);
      const onTrip = assignedTrips.find((b) => b.status === "in_progress");

      let availabilityStatus: "available" | "assigned" | "on_trip" | "inactive" = "available";
      let statusReason: string | undefined = undefined;

      if (!d.isActive || d.status === "inactive") {
        availabilityStatus = "inactive";
        statusReason = "Driver on leave or inactive";
      } else if (onTrip) {
        availabilityStatus = "on_trip";
        statusReason = `Driving trip to ${onTrip.destination} (${onTrip.bookingReference})`;
      } else if (assignedTrips.length > 0) {
        availabilityStatus = "assigned";
        statusReason = `Assigned to ${assignedTrips[0].customerName} (${assignedTrips[0].destination})`;
      }

      return {
        driver: d,
        availabilityStatus,
        statusReason,
        currentTrip: onTrip || assignedTrips[0] || undefined,
        dayTrips: assignedTrips,
      };
    });

    // Compute Summary Metrics
    const unassignedVehiclesCount = activeTrips.filter(
      (b) => b.status !== "completed" && !b.assignedVehicleId
    ).length;

    const unassignedDriversCount = activeTrips.filter(
      (b) => b.status !== "completed" && !b.assignedDriverId
    ).length;

    const availableVehiclesCount = vehicleAvailability.filter(
      (va) => va.availabilityStatus === "available"
    ).length;

    const vehiclesOnTripCount = vehicleAvailability.filter(
      (va) => va.availabilityStatus === "on_trip"
    ).length;

    const vehiclesMaintenanceCount = vehicleAvailability.filter(
      (va) => va.availabilityStatus === "maintenance"
    ).length;

    const availableDriversCount = driverAvailability.filter(
      (da) => da.availabilityStatus === "available"
    ).length;

    const inProgressCount = activeTrips.filter((b) => b.status === "in_progress").length;
    const completedCount = activeTrips.filter((b) => b.status === "completed").length;

    const metrics: OperationalSummaryMetrics = {
      totalTrips: activeTrips.length,
      unassignedVehiclesCount,
      unassignedDriversCount,
      availableVehiclesCount,
      vehiclesOnTripCount,
      vehiclesMaintenanceCount,
      availableDriversCount,
      inProgressCount,
      completedCount,
    };

    // Apply Client Filter on activeTrips if provided
    let filteredTrips = [...activeTrips];

    if (filter?.assignment) {
      if (filter.assignment === "fully_assigned") {
        filteredTrips = filteredTrips.filter(
          (b) => Boolean(b.assignedVehicleId) && Boolean(b.assignedDriverId)
        );
      } else if (filter.assignment === "vehicle_missing") {
        filteredTrips = filteredTrips.filter((b) => !b.assignedVehicleId);
      } else if (filter.assignment === "driver_missing") {
        filteredTrips = filteredTrips.filter((b) => !b.assignedDriverId);
      } else if (filter.assignment === "both_missing") {
        filteredTrips = filteredTrips.filter((b) => !b.assignedVehicleId && !b.assignedDriverId);
      }
    }

    if (filter?.status && filter.status !== "all") {
      filteredTrips = filteredTrips.filter((b) => b.status === filter.status);
    }

    if (filter?.vehicleId && filter.vehicleId !== "all") {
      filteredTrips = filteredTrips.filter((b) => b.assignedVehicleId === filter.vehicleId);
    }

    if (filter?.driverId && filter.driverId !== "all") {
      filteredTrips = filteredTrips.filter((b) => b.assignedDriverId === filter.driverId);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      filteredTrips = filteredTrips.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.customerMobile.includes(q) ||
          b.destination.toLowerCase().includes(q) ||
          b.bookingReference.toLowerCase().includes(q) ||
          (b.assignedDriverName && b.assignedDriverName.toLowerCase().includes(q)) ||
          (b.assignedVehicleName && b.assignedVehicleName.toLowerCase().includes(q))
      );
    }

    return {
      date: targetDate,
      formattedDate: formatKolkataDisplayDate(targetDate),
      isToday: targetDate === todayStr,
      isTomorrow: targetDate === tomorrowStr,
      metrics,
      trips: filteredTrips,
      attentionTrips,
      cancelledTrips,
      vehicles: vehicleAvailability,
      drivers: driverAvailability,
      allDriversList,
      allVehiclesList,
    };
  } catch (err) {
    console.error("[Get Daily Operations Action Error]:", err);
    throw err;
  }
}

/**
 * Quick assign vehicle and driver directly from daily operations screen
 */
export async function quickAssignTripAction(params: {
  bookingId: string;
  vehicleId?: string;
  driverId?: string;
  actorName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    let vehicleName: string | null = null;
    let driverName: string | null = null;
    let driverMobile: string | null = null;

    if (params.vehicleId) {
      const { data: v } = await (supabase.from("vehicles") as any)
        .select("name, display_name, registration_number")
        .eq("id", params.vehicleId)
        .single();
      if (v) {
        vehicleName = v.display_name || `${v.name}${v.registration_number ? ` (${v.registration_number})` : ""}`;
      }
    }

    if (params.driverId) {
      const { data: d } = await (supabase.from("drivers") as any)
        .select("name, mobile_number")
        .eq("id", params.driverId)
        .single();
      if (d) {
        driverName = d.name;
        driverMobile = d.mobile_number;
      }
    }

    // Determine new status: if confirmed and assigned both, progress to assigned
    const updatePayload: any = {
      assigned_vehicle_id: params.vehicleId || null,
      assigned_vehicle_name: vehicleName,
      assigned_driver_id: params.driverId || null,
      assigned_driver_name: driverName,
      assigned_driver_mobile: driverMobile,
      updated_at: new Date().toISOString(),
    };

    if (params.vehicleId || params.driverId) {
      updatePayload.status = "assigned";
    }

    const { error } = await (supabase.from("bookings") as any)
      .update(updatePayload)
      .eq("id", params.bookingId);

    if (error) throw error;

    // Log Activity
    await (supabase.from("booking_activity") as any).insert([
      {
        booking_id: params.bookingId,
        actor_name: params.actorName || "Admin (Quick Dispatch)",
        action: "quick_dispatch_assigned",
        description: `Operations Dispatch: Assigned Cab: ${vehicleName || "None"} • Driver: ${driverName || "None"}.`,
      },
    ]);

    revalidatePath("/admin/operations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${params.bookingId}`);

    return { success: true };
  } catch (err: any) {
    console.error("[Quick Assign Trip Error]:", err);
    return { success: false, error: err.message || "Failed to assign vehicle/driver." };
  }
}

/**
 * Quick update trip status (Start Trip / Complete Trip)
 */
export async function quickUpdateTripStatusAction(params: {
  bookingId: string;
  newStatus: BookingStatus;
  actorName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await (supabase.from("bookings") as any)
      .update({
        status: params.newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.bookingId);

    if (error) throw error;

    const actionLabel =
      params.newStatus === "in_progress"
        ? "Trip Started"
        : params.newStatus === "completed"
        ? "Trip Completed"
        : `Status changed to ${params.newStatus}`;

    await (supabase.from("booking_activity") as any).insert([
      {
        booking_id: params.bookingId,
        actor_name: params.actorName || "Admin (Quick Operations)",
        action: `quick_status_${params.newStatus}`,
        description: `Operations update: ${actionLabel}.`,
      },
    ]);

    revalidatePath("/admin/operations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${params.bookingId}`);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update trip status." };
  }
}

/**
 * Set Vehicle Maintenance Status
 */
export async function setVehicleMaintenanceAction(params: {
  vehicleId: string;
  isMaintenance: boolean;
  notes?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const status = params.isMaintenance ? "maintenance" : "available";

    const payload: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (params.notes !== undefined) payload.notes = params.notes;

    const { error } = await (supabase.from("vehicles") as any)
      .update(payload)
      .eq("id", params.vehicleId);

    if (error) throw error;

    revalidatePath("/admin/operations");
    revalidatePath("/admin/vehicles");
    revalidatePath(`/admin/vehicles/${params.vehicleId}`);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update vehicle maintenance status." };
  }
}
