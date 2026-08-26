"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  BookingItem,
  BookingStatus,
  DriverItem,
  VehicleItem,
  VehicleStatus,
  DriverStatus,
  BookingActivityItem,
  BookingNoteItem,
  BookingStopItem,
  BookingPaymentStatus,
  BookingPaymentMethod,
} from "@/types/booking";
import { revalidatePath } from "next/cache";

/**
 * Helper to generate human-safe reference number: SSB-YYYY-XXXX
 */
function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let randomCode = "";
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SSB-${year}-${randomCode}`;
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
    paymentStatus: (row.payment_status as BookingPaymentStatus) || "not_recorded",
    paymentMethod: (row.payment_method as BookingPaymentMethod) || undefined,
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
 * Fetch list of drivers
 */
export async function getDriversListAction(params?: { activeOnly?: boolean }): Promise<DriverItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    let query = (supabase.from("drivers") as any)
      .select("*")
      .order("name", { ascending: true });

    if (params?.activeOnly) {
      query = query.neq("status", "inactive");
    }

    const { data, error } = await query;

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      mobileNumber: d.mobile_number,
      alternateMobile: d.alternate_mobile || undefined,
      email: d.email || undefined,
      status: (d.status as DriverStatus) || "available",
      isActive: d.is_active !== false,
      notes: d.notes || undefined,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  } catch (err) {
    return [];
  }
}

/**
 * Check overlapping trip conflicts for a driver or vehicle.
 * Supports multi-day bookings: checks if the date range [travelDate, returnDate]
 * overlaps with any existing active booking for the same resource.
 * Excludes cancelled, completed, no_show bookings.
 */
export async function checkConflictsAction(params: {
  travelDate: string;
  returnDate?: string;
  driverId?: string;
  vehicleId?: string;
  excludeBookingId?: string;
}): Promise<{ driverConflict?: string; vehicleConflict?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase || !params.travelDate) return {};

    const result: { driverConflict?: string; vehicleConflict?: string } = {};

    // A booking's period spans: [travel_date ... (return_date OR travel_date)]
    // Two periods overlap when: A.start <= B.end AND A.end >= B.start
    const checkStart = params.travelDate;
    const checkEnd = params.returnDate || params.travelDate;

    // Active booking statuses (not done/cancelled)
    const activeStatuses = ["confirmed", "assigned", "in_progress", "draft"];

    if (params.driverId) {
      let q = (supabase.from("bookings") as any)
        .select("booking_reference, pickup_time, destination, travel_date, return_date")
        .eq("assigned_driver_id", params.driverId)
        .in("status", activeStatuses)
        // Overlap: existing.travel_date <= checkEnd AND (existing.return_date OR existing.travel_date) >= checkStart
        .lte("travel_date", checkEnd);

      if (params.excludeBookingId && params.excludeBookingId !== "new") {
        q = q.neq("id", params.excludeBookingId);
      }

      const { data: driverMatches } = await q;

      const driverOverlap = (driverMatches || []).find((b: any) => {
        const bEnd = b.return_date || b.travel_date;
        return bEnd >= checkStart;
      });

      if (driverOverlap) {
        const periodStr = driverOverlap.return_date
          ? `${driverOverlap.travel_date} – ${driverOverlap.return_date}`
          : driverOverlap.travel_date;
        result.driverConflict = `Driver already has a trip during this period (${periodStr} → ${driverOverlap.destination}, Ref: ${driverOverlap.booking_reference}). Please verify scheduling.`;
      }
    }

    if (params.vehicleId) {
      let q = (supabase.from("bookings") as any)
        .select("booking_reference, pickup_time, destination, travel_date, return_date")
        .eq("assigned_vehicle_id", params.vehicleId)
        .in("status", activeStatuses)
        .lte("travel_date", checkEnd);

      if (params.excludeBookingId && params.excludeBookingId !== "new") {
        q = q.neq("id", params.excludeBookingId);
      }

      const { data: vehicleMatches } = await q;

      const vehicleOverlap = (vehicleMatches || []).find((b: any) => {
        const bEnd = b.return_date || b.travel_date;
        return bEnd >= checkStart;
      });

      if (vehicleOverlap) {
        const periodStr = vehicleOverlap.return_date
          ? `${vehicleOverlap.travel_date} – ${vehicleOverlap.return_date}`
          : vehicleOverlap.travel_date;
        result.vehicleConflict = `Vehicle already has a trip during this period (${periodStr} → ${vehicleOverlap.destination}, Ref: ${vehicleOverlap.booking_reference}). Please verify scheduling.`;
      }
    }

    return result;
  } catch (err) {
    return {};
  }
}

/**
 * Fetch paginated & filtered list of bookings
 */
export async function getBookingsListAction(params: {
  page?: number;
  limit?: number;
  status?: string;
  dateFilter?: string;
  search?: string;
  driverId?: string;
  vehicleId?: string;
}): Promise<{
  bookings: BookingItem[];
  totalCount: number;
  page: number;
  totalPages: number;
}> {
  try {
    const supabase = createSupabaseServerClient();
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(params.limit) || 15));
    const offset = (page - 1) * limit;

    if (!supabase) return { bookings: [], totalCount: 0, page: 1, totalPages: 1 };

    let query = (supabase.from("bookings") as any).select("*", { count: "exact" });

    // Status filter
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    // Driver filter
    if (params.driverId && params.driverId !== "all") {
      query = query.eq("assigned_driver_id", params.driverId);
    }

    // Vehicle filter
    if (params.vehicleId && params.vehicleId !== "all") {
      query = query.eq("assigned_vehicle_id", params.vehicleId);
    }

    // Search query
    if (params.search && params.search.trim().length > 0) {
      const q = params.search.trim();
      query = query.or(
        `customer_name.ilike.%${q}%,customer_mobile.ilike.%${q}%,destination.ilike.%${q}%,booking_reference.ilike.%${q}%`
      );
    }

    // Date filters
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    if (params.dateFilter === "today") {
      query = query.eq("travel_date", todayStr);
    } else if (params.dateFilter === "tomorrow") {
      const tomorrow = new Date(now.getTime() + 86400000).toISOString().split("T")[0];
      query = query.eq("travel_date", tomorrow);
    } else if (params.dateFilter === "upcoming") {
      query = query.gte("travel_date", todayStr);
    } else if (params.dateFilter === "past") {
      query = query.lt("travel_date", todayStr);
    }

    query = query.order("travel_date", { ascending: true }).order("created_at", { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const bookings = (data || []).map(mapBookingRow);

    return { bookings, totalCount, page, totalPages };
  } catch (err) {
    console.error("[Get Bookings Error]:", err);
    return { bookings: [], totalCount: 0, page: 1, totalPages: 1 };
  }
}

/**
 * Fetch single booking with stops, notes, and activity timeline
 */
export async function getBookingDetailAction(id: string): Promise<BookingItem | null> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("bookings") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    const booking = mapBookingRow(row);

    // Fetch stops
    const { data: stopsData } = await (supabase.from("booking_stops") as any)
      .select("*")
      .eq("booking_id", id)
      .order("stop_order", { ascending: true });

    booking.stops = (stopsData || []).map((s: any) => ({
      id: s.id,
      bookingId: s.booking_id,
      stopOrder: s.stop_order,
      location: s.location,
      landmark: s.landmark,
      notes: s.notes,
    }));

    // Fetch notes
    const { data: notesData } = await (supabase.from("booking_notes") as any)
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: false });

    booking.notes = (notesData || []).map((n: any) => ({
      id: n.id,
      bookingId: n.booking_id,
      authorId: n.author_id,
      authorName: n.author_name || "Staff",
      note: n.note,
      createdAt: n.created_at,
    }));

    // Fetch activity timeline
    const { data: activityData } = await (supabase.from("booking_activity") as any)
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: false });

    booking.activities = (activityData || []).map((a: any) => ({
      id: a.id,
      bookingId: a.booking_id,
      actorName: a.actor_name || "Admin",
      action: a.action,
      description: a.description,
      createdAt: a.created_at,
    }));

    return booking;
  } catch (err) {
    console.error("[Get Booking Detail Error]:", err);
    return null;
  }
}

/**
 * Save / Create / Edit Booking
 */
export async function saveBookingAction(booking: Partial<BookingItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!booking.customerName?.trim() || !booking.customerMobile?.trim() || !booking.destination?.trim() || !booking.travelDate) {
      return { success: false, error: "Customer name, mobile number, destination, and travel date are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const isNew = !booking.id || booking.id === "new";
    const bookingRef = booking.bookingReference || generateBookingReference();

    const finalFare = booking.finalFare != null ? Number(booking.finalFare) : null;
    const advance = booking.advanceReceived != null ? Number(booking.advanceReceived) : 0;
    const balance = finalFare != null ? Math.max(0, finalFare - advance) : 0;

    const payload: any = {
      booking_reference: bookingRef,
      enquiry_id: booking.enquiryId || null,
      customer_name: booking.customerName.trim(),
      customer_mobile: booking.customerMobile.trim(),
      customer_whatsapp: booking.customerWhatsapp?.trim() || null,
      customer_email: booking.customerEmail?.trim() || null,
      pickup_location: booking.pickupLocation?.trim() || "Shirdi",
      pickup_landmark: booking.pickupLandmark?.trim() || null,
      destination: booking.destination.trim(),
      destination_landmark: booking.destinationLandmark?.trim() || null,
      travel_date: booking.travelDate,
      pickup_time: booking.pickupTime?.trim() || null,
      return_date: booking.returnDate || null,
      return_pickup_time: booking.returnPickupTime?.trim() || null,
      trip_type: booking.tripType || "one_way",
      passenger_count: Number(booking.passengerCount) || 1,
      children_count: Number(booking.childrenCount) || 0,
      vehicle_category_id: booking.vehicleCategoryId || null,
      vehicle_category_name: booking.vehicleCategoryName || "SUV / MUV (Ertiga / Tavera)",
      assigned_vehicle_id: booking.assignedVehicleId || null,
      assigned_vehicle_name: booking.assignedVehicleName || null,
      assigned_driver_id: booking.assignedDriverId || null,
      assigned_driver_name: booking.assignedDriverName || null,
      assigned_driver_mobile: booking.assignedDriverMobile || null,
      quoted_fare: booking.quotedFare != null ? Number(booking.quotedFare) : null,
      final_fare: finalFare,
      advance_received: advance,
      balance_amount: balance,
      payment_status: booking.paymentStatus || "not_recorded",
      payment_method: booking.paymentMethod || null,
      status: booking.status || "confirmed",
      journey_notes: booking.journeyNotes?.trim() || null,
      cancellation_reason: booking.cancellationReason?.trim() || null,
      booking_source: booking.bookingSource || "website",
      updated_at: new Date().toISOString(),
    };

    let targetId = booking.id;

    if (!isNew && targetId) {
      const { error } = await (supabase.from("bookings") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;

      // Log update activity
      await (supabase.from("booking_activity") as any).insert([
        {
          booking_id: targetId,
          actor_name: "Ramesh Shep",
          action: "booking_updated",
          description: `Booking details updated for travel date ${booking.travelDate}.`,
        },
      ]);
    } else {
      const { data, error } = await (supabase.from("bookings") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      targetId = data.id;

      // Log creation activity
      await (supabase.from("booking_activity") as any).insert([
        {
          booking_id: targetId,
          actor_name: "Ramesh Shep",
          action: "booking_created",
          description: `Booking created with reference ${bookingRef} for ${booking.customerName} (${booking.pickupLocation} → ${booking.destination}).`,
        },
      ]);
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/bookings");
    if (targetId) revalidatePath(`/admin/bookings/${targetId}`);

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Booking Error]:", err);
    return { success: false, error: err.message || "Failed to save booking." };
  }
}

/**
 * Update Booking Status
 */
export async function updateBookingStatusAction(params: {
  id: string;
  oldStatus: BookingStatus;
  newStatus: BookingStatus;
  actorName?: string;
  note?: string;
  cancellationReason?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const updatePayload: any = {
      status: params.newStatus,
      updated_at: new Date().toISOString(),
    };

    if (params.cancellationReason) {
      updatePayload.cancellation_reason = params.cancellationReason.trim();
    }

    const { error } = await (supabase.from("bookings") as any)
      .update(updatePayload)
      .eq("id", params.id);

    if (error) throw error;

    // Log activity
    const actionDesc = params.newStatus === "cancelled"
      ? `Booking cancelled. Reason: ${params.cancellationReason || "Customer request"}`
      : `Status changed from ${params.oldStatus} to ${params.newStatus}. ${params.note || ""}`.trim();

    await (supabase.from("booking_activity") as any).insert([
      {
        booking_id: params.id,
        actor_name: params.actorName || "Ramesh / Admin",
        action: `status_${params.newStatus}`,
        description: actionDesc,
      },
    ]);

    if (params.note && params.note.trim()) {
      await (supabase.from("booking_notes") as any).insert([
        {
          booking_id: params.id,
          author_name: params.actorName || "Admin",
          note: `[Status: ${params.newStatus}] ${params.note.trim()}`,
        },
      ]);
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${params.id}`);

    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update booking status." };
  }
}

/**
 * Assign driver and vehicle to booking
 */
export async function assignDriverAndVehicleAction(params: {
  id: string;
  driverId?: string;
  driverName?: string;
  driverMobile?: string;
  vehicleId?: string;
  vehicleName?: string;
  actorName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error } = await (supabase.from("bookings") as any)
      .update({
        assigned_driver_id: params.driverId || null,
        assigned_driver_name: params.driverName || null,
        assigned_driver_mobile: params.driverMobile || null,
        assigned_vehicle_id: params.vehicleId || null,
        assigned_vehicle_name: params.vehicleName || null,
        status: "assigned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (error) throw error;

    await (supabase.from("booking_activity") as any).insert([
      {
        booking_id: params.id,
        actor_name: params.actorName || "Admin",
        action: "driver_vehicle_assigned",
        description: `Assigned Vehicle: ${params.vehicleName || "None"} • Assigned Driver: ${params.driverName || "None"}.`,
      },
    ]);

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${params.id}`);

    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to assign driver / vehicle." };
  }
}

/**
 * Add private note to booking
 */
export async function addBookingNoteAction(params: {
  bookingId: string;
  note: string;
  authorName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!params.note?.trim()) return { success: false, error: "Note cannot be blank." };

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await (supabase.from("booking_notes") as any).insert([
      {
        booking_id: params.bookingId,
        author_name: params.authorName || "Ramesh Shep",
        note: params.note.trim(),
      },
    ]);

    if (error) throw error;

    revalidatePath(`/admin/bookings/${params.bookingId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to save internal note." };
  }
}

/**
 * Record internal payment/fare amounts
 */
export async function recordPaymentAction(params: {
  bookingId: string;
  finalFare?: number;
  advanceReceived?: number;
  paymentMethod?: BookingPaymentMethod;
  paymentStatus: BookingPaymentStatus;
  actorName?: string;
  note?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const finalFare = params.finalFare != null ? Number(params.finalFare) : null;
    const advance = params.advanceReceived != null ? Number(params.advanceReceived) : 0;
    const balance = finalFare != null ? Math.max(0, finalFare - advance) : 0;

    const { error } = await (supabase.from("bookings") as any)
      .update({
        final_fare: finalFare,
        advance_received: advance,
        balance_amount: balance,
        payment_status: params.paymentStatus,
        payment_method: params.paymentMethod || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.bookingId);

    if (error) throw error;

    await (supabase.from("booking_activity") as any).insert([
      {
        booking_id: params.bookingId,
        actor_name: params.actorName || "Admin",
        action: "payment_recorded",
        description: `Payment recorded: Final Fare ₹${finalFare || 0} • Advance ₹${advance} • Balance ₹${balance} (${params.paymentStatus}, ${params.paymentMethod || "Method not specified"}).`,
      },
    ]);

    revalidatePath(`/admin/bookings/${params.bookingId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to record payment details." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VEHICLE MANAGEMENT ACTIONS (Module 10)
// ─────────────────────────────────────────────────────────────────────────────

function mapVehicleRow(row: any): VehicleItem {
  let parsedImages: any[] = [];
  try {
    if (Array.isArray(row.images)) {
      parsedImages = row.images;
    } else if (typeof row.images === "string") {
      parsedImages = JSON.parse(row.images);
    }
  } catch {
    parsedImages = [];
  }

  return {
    id: row.id,
    name: row.name,
    displayName: row.display_name || row.name,
    registrationNumber: row.registration_number || undefined,
    categoryId: row.category_id || undefined,
    categoryName: row.vehicle_categories?.name || undefined,
    seatingCapacity: row.seating_capacity || 6,
    ownerType: row.owner_type || "owned",
    status: (row.status as VehicleStatus) || "available",
    fuelType: row.fuel_type || undefined,
    acType: row.ac_type || undefined,
    notes: row.notes || undefined,
    description: row.description || undefined,
    imageUrl: row.image_url || undefined,
    images: parsedImages,
    altText: row.alt_text || undefined,
    showInHero: row.show_in_hero !== false,
    isActive: row.is_active !== false,
    displayOrder: row.display_order || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Fetch all vehicles for admin management
 */
export async function getVehiclesListAction(params?: {
  activeOnly?: boolean;
}): Promise<VehicleItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    let query = (supabase.from("vehicles") as any)
      .select("*, vehicle_categories(name)")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (params?.activeOnly) {
      query = query.neq("status", "inactive");
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapVehicleRow);
  } catch (err) {
    console.error("[Get Vehicles Error]:", err);
    return [];
  }
}

/**
 * Get single vehicle by ID
 */
export async function getVehicleByIdAction(id: string): Promise<VehicleItem | null> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await (supabase.from("vehicles") as any)
      .select("*, vehicle_categories(name)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapVehicleRow(data);
  } catch (err) {
    return null;
  }
}

/**
 * Create or update a vehicle record
 */
export async function saveVehicleAction(vehicle: Partial<VehicleItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!vehicle.name?.trim()) {
      return { success: false, error: "Vehicle name is required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const isNew = !vehicle.id || vehicle.id === "new";

    const payload: any = {
      name: vehicle.name.trim(),
      display_name: vehicle.displayName?.trim() || vehicle.name.trim(),
      registration_number: vehicle.registrationNumber?.trim() || null,
      category_id: vehicle.categoryId || null,
      seating_capacity: Number(vehicle.seatingCapacity) || 6,
      owner_type: vehicle.ownerType || "owned",
      status: vehicle.status || "available",
      fuel_type: vehicle.fuelType?.trim() || "Diesel",
      ac_type: vehicle.acType?.trim() || "AC",
      notes: vehicle.notes?.trim() || null,
      description: vehicle.description?.trim() || null,
      image_url: vehicle.imageUrl?.trim() || null,
      images: vehicle.images ? JSON.stringify(vehicle.images) : JSON.stringify([]),
      alt_text: vehicle.altText?.trim() || null,
      show_in_hero: vehicle.showInHero !== false,
      is_active: vehicle.isActive !== false,
      display_order: Number(vehicle.displayOrder) || 0,
      updated_at: new Date().toISOString(),
    };

    let targetId = vehicle.id;

    if (!isNew && targetId) {
      const { error } = await (supabase.from("vehicles") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("vehicles") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      targetId = data.id;
    }

    revalidatePath("/admin/vehicles");
    if (targetId) revalidatePath(`/admin/vehicles/${targetId}`);

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Vehicle Error]:", err);
    return { success: false, error: err.message || "Failed to save vehicle." };
  }
}

/**
 * Toggle vehicle active/inactive status
 */
export async function toggleVehicleStatusAction(params: {
  id: string;
  isActive: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const newStatus = params.isActive ? "available" : "inactive";

    const { error } = await (supabase.from("vehicles") as any)
      .update({ is_active: params.isActive, status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (error) throw error;

    revalidatePath("/admin/vehicles");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update vehicle status." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DRIVER MANAGEMENT ACTIONS (Module 10)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get single driver by ID
 */
export async function getDriverByIdAction(id: string): Promise<DriverItem | null> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await (supabase.from("drivers") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      mobileNumber: data.mobile_number,
      alternateMobile: data.alternate_mobile || undefined,
      email: data.email || undefined,
      status: (data.status as DriverStatus) || "available",
      isActive: data.is_active !== false,
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Create or update a driver record
 */
export async function saveDriverAction(driver: Partial<DriverItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!driver.name?.trim() || !driver.mobileNumber?.trim()) {
      return { success: false, error: "Driver name and mobile number are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const isNew = !driver.id || driver.id === "new";

    const payload: any = {
      name: driver.name.trim(),
      mobile_number: driver.mobileNumber.trim(),
      alternate_mobile: driver.alternateMobile?.trim() || null,
      email: driver.email?.trim() || null,
      status: driver.status || "available",
      is_active: driver.isActive !== false,
      notes: driver.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    let targetId = driver.id;

    if (!isNew && targetId) {
      const { error } = await (supabase.from("drivers") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("drivers") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      targetId = data.id;
    }

    revalidatePath("/admin/drivers");
    if (targetId) revalidatePath(`/admin/drivers/${targetId}`);

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Driver Error]:", err);
    return { success: false, error: err.message || "Failed to save driver." };
  }
}

/**
 * Toggle driver active/inactive status
 */
export async function toggleDriverStatusAction(params: {
  id: string;
  isActive: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const newStatus = params.isActive ? "available" : "inactive";

    const { error } = await (supabase.from("drivers") as any)
      .update({ is_active: params.isActive, status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (error) throw error;

    revalidatePath("/admin/drivers");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update driver status." };
  }
}

/**
 * Get dashboard operational data: today's trips, unassigned confirmed bookings
 */
export async function getOperationalDashboardAction(): Promise<{
  todayTrips: BookingItem[];
  unassignedTrips: BookingItem[];
  upcomingTrips: BookingItem[];
}> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { todayTrips: [], unassignedTrips: [], upcomingTrips: [] };

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const in7DaysStr = new Date(now.getTime() + 7 * 86400000).toISOString().split("T")[0];

    const [todayRes, unassignedRes, upcomingRes] = await Promise.all([
      (supabase.from("bookings") as any)
        .select("*")
        .eq("travel_date", todayStr)
        .not("status", "in", '("cancelled","completed","no_show")')
        .order("pickup_time", { ascending: true, nullsFirst: false })
        .limit(10),

      (supabase.from("bookings") as any)
        .select("*")
        .in("status", ["confirmed", "draft"])
        .is("assigned_vehicle_id", null)
        .gte("travel_date", todayStr)
        .order("travel_date", { ascending: true })
        .limit(8),

      (supabase.from("bookings") as any)
        .select("*")
        .gte("travel_date", todayStr)
        .lte("travel_date", in7DaysStr)
        .not("status", "in", '("cancelled","completed","no_show")')
        .order("travel_date", { ascending: true })
        .order("pickup_time", { ascending: true, nullsFirst: false })
        .limit(12),
    ]);

    return {
      todayTrips: (todayRes.data || []).map(mapBookingRow),
      unassignedTrips: (unassignedRes.data || []).map(mapBookingRow),
      upcomingTrips: (upcomingRes.data || []).map(mapBookingRow),
    };
  } catch (err) {
    console.error("[Operational Dashboard Error]:", err);
    return { todayTrips: [], unassignedTrips: [], upcomingTrips: [] };
  }
}
