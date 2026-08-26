"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  AdminEnquiryItem,
  DashboardMetrics,
  EnquiryNoteItem,
  EnquiryStatusHistoryItem,
} from "@/types/admin";
import { EnquiryStatus } from "@/types/enquiry";
import { revalidatePath } from "next/cache";

/**
 * Format database row into typed AdminEnquiryItem
 */
function mapEnquiryRow(row: any): AdminEnquiryItem {
  return {
    id: row.id,
    referenceNumber: row.reference_number || `SS-${row.id.slice(0, 8).toUpperCase()}`,
    customerName: row.customer_name || "Unknown Devotee",
    mobileNumber: row.mobile_number || row.customer_mobile || "",
    whatsappNumber: row.whatsapp_number || row.customer_whatsapp || "",
    email: row.email || row.customer_email || "",
    pickupLocation: row.pickup_location || "Shirdi",
    destination: row.destination || row.drop_location || "Not specified",
    tripType: row.trip_type || "one_way",
    travelDate: row.travel_date || undefined,
    returnDate: row.return_date || undefined,
    pickupTime: row.pickup_time || undefined,
    passengerCount: row.passenger_count || 1,
    childrenCount: row.children_count || 0,
    vehicleCategorySlug: row.vehicle_category_slug || undefined,
    vehiclePreferenceText: row.vehicle_preference_text || row.preferred_vehicle || "Not specified",
    additionalRequirements: row.additional_requirements || row.customer_notes || undefined,
    requestIntent: row.request_intent || "quote",
    enquiryType: row.enquiry_type || "general",
    sourcePage: row.source_page || undefined,
    serviceSlug: row.service_slug || undefined,
    routeSlug: row.route_slug || undefined,
    destinationSlug: row.destination_slug || undefined,
    packageSlug: row.package_slug || undefined,
    status: (row.status as EnquiryStatus) || "new",
    internalNotes: row.internal_notes || row.admin_notes || undefined,
    followUpAt: row.follow_up_at || undefined,
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Module 9 — Source Attribution
    landingPage: row.landing_page || undefined,
    contextType: row.context_type || undefined,
    utmSource: row.utm_source || undefined,
    utmMedium: row.utm_medium || undefined,
    utmCampaign: row.utm_campaign || undefined,
  };
}

/**
 * Fetch summary metrics for Admin Dashboard
 */
export async function getDashboardMetricsAction(): Promise<DashboardMetrics> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return {
        newEnquiriesCount: 0,
        todayEnquiriesCount: 0,
        followUpsCount: 0,
        confirmedUpcomingCount: 0,
        recentEnquiries: [],
      };
    }

    // Current date in IST (Asia/Kolkata)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // 1. Fetch recent non-archived enquiries
    const { data: recentRows, error: recentError } = await (supabase.from("enquiries") as any)
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(8);

    const recentEnquiries = (recentRows || []).map(mapEnquiryRow);

    // 2. Fetch counts
    const { count: newCount } = await (supabase.from("enquiries") as any)
      .select("*", { count: "exact", head: true })
      .eq("status", "new")
      .eq("is_archived", false);

    const { count: todayCount } = await (supabase.from("enquiries") as any)
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart)
      .eq("is_archived", false);

    const { count: followUpCount } = await (supabase.from("enquiries") as any)
      .select("*", { count: "exact", head: true })
      .eq("status", "follow_up")
      .eq("is_archived", false);

    const { count: confirmedCount } = await (supabase.from("enquiries") as any)
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed")
      .eq("is_archived", false);

    return {
      newEnquiriesCount: newCount || 0,
      todayEnquiriesCount: todayCount || 0,
      followUpsCount: followUpCount || 0,
      confirmedUpcomingCount: confirmedCount || 0,
      recentEnquiries,
    };
  } catch (err) {
    console.error("[Dashboard Metrics Error]:", err);
    return {
      newEnquiriesCount: 0,
      todayEnquiriesCount: 0,
      followUpsCount: 0,
      confirmedUpcomingCount: 0,
      recentEnquiries: [],
    };
  }
}

/**
 * Fetch filtered, searched, and paginated enquiries list
 */
export async function getEnquiriesListAction(params: {
  page?: number;
  limit?: number;
  status?: string;
  dateFilter?: string;
  search?: string;
  sortBy?: string;
}): Promise<{
  enquiries: AdminEnquiryItem[];
  totalCount: number;
  page: number;
  totalPages: number;
}> {
  try {
    const supabase = createSupabaseServerClient();
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(params.limit) || 15));
    const offset = (page - 1) * limit;

    if (!supabase) {
      return { enquiries: [], totalCount: 0, page: 1, totalPages: 1 };
    }

    let query = (supabase.from("enquiries") as any).select("*", { count: "exact" });

    // Filter archived
    query = query.eq("is_archived", false);

    // Status filter
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    // Search query
    if (params.search && params.search.trim().length > 0) {
      const q = params.search.trim();
      query = query.or(
        `customer_name.ilike.%${q}%,mobile_number.ilike.%${q}%,destination.ilike.%${q}%,reference_number.ilike.%${q}%`
      );
    }

    // Date filters
    const now = new Date();
    const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    if (params.dateFilter === "today") {
      query = query.gte("created_at", todayStr);
    } else if (params.dateFilter === "upcoming") {
      const todayDate = now.toISOString().split("T")[0];
      query = query.gte("travel_date", todayDate);
    }

    // Sorting
    if (params.sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (params.sortBy === "travel_date") {
      query = query.order("travel_date", { ascending: true, nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const enquiries = (data || []).map(mapEnquiryRow);

    return {
      enquiries,
      totalCount,
      page,
      totalPages,
    };
  } catch (err) {
    console.error("[Get Enquiries Error]:", err);
    return { enquiries: [], totalCount: 0, page: 1, totalPages: 1 };
  }
}

/**
 * Fetch complete single enquiry with notes & status history
 */
export async function getEnquiryDetailAction(
  id: string
): Promise<AdminEnquiryItem | null> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("enquiries") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    const enquiry = mapEnquiryRow(row);

    // Fetch notes
    const { data: notesData } = await (supabase.from("enquiry_notes") as any)
      .select("*")
      .eq("enquiry_id", id)
      .order("created_at", { ascending: false });

    enquiry.notes = (notesData || []).map((n: any) => ({
      id: n.id,
      enquiryId: n.enquiry_id,
      authorId: n.author_id,
      authorName: n.author_name || "Staff",
      note: n.note,
      createdAt: n.created_at,
    }));

    // Fetch status history
    const { data: historyData } = await (supabase.from("enquiry_status_history") as any)
      .select("*")
      .eq("enquiry_id", id)
      .order("changed_at", { ascending: false });

    enquiry.statusHistory = (historyData || []).map((h: any) => ({
      id: h.id,
      enquiryId: h.enquiry_id,
      oldStatus: h.old_status as EnquiryStatus,
      newStatus: h.new_status as EnquiryStatus,
      changedBy: h.changed_by,
      changedByName: h.changed_by_name || "Admin",
      changedAt: h.changed_at,
    }));

    return enquiry;
  } catch (err) {
    console.error("[Get Enquiry Detail Error]:", err);
    return null;
  }
}

/**
 * Update enquiry status and append to audit history
 */
export async function updateEnquiryStatusAction(params: {
  id: string;
  oldStatus: EnquiryStatus;
  newStatus: EnquiryStatus;
  authorName?: string;
  note?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return { success: false, error: "Database client unavailable." };
    }

    const { error: updateError } = await (supabase.from("enquiries") as any)
      .update({
        status: params.newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (updateError) throw updateError;

    // Log status history
    try {
      await (supabase.from("enquiry_status_history") as any).insert([
        {
          enquiry_id: params.id,
          old_status: params.oldStatus,
          new_status: params.newStatus,
          changed_by_name: params.authorName || "Ramesh / Admin",
        },
      ]);
    } catch (hErr) {
      console.warn("[Status History Log Warning]:", hErr);
    }

    // If a note was provided during status change, insert it
    if (params.note && params.note.trim().length > 0) {
      try {
        await (supabase.from("enquiry_notes") as any).insert([
          {
            enquiry_id: params.id,
            author_name: params.authorName || "Admin",
            note: `[Status changed to ${params.newStatus}] ${params.note.trim()}`,
          },
        ]);
      } catch (nErr) {
        console.warn("[Note Insert Warning]:", nErr);
      }
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${params.id}`);

    return { success: true };
  } catch (err) {
    console.error("[Update Status Error]:", err);
    return { success: false, error: "Failed to update enquiry status." };
  }
}

/**
 * Add a private internal note
 */
export async function addEnquiryNoteAction(params: {
  enquiryId: string;
  note: string;
  authorName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const noteText = params.note?.trim();
    if (!noteText) {
      return { success: false, error: "Please enter a note." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return { success: false, error: "Database client unavailable." };
    }

    const { error } = await (supabase.from("enquiry_notes") as any).insert([
      {
        enquiry_id: params.enquiryId,
        author_name: params.authorName || "Ramesh Shep",
        note: noteText,
      },
    ]);

    if (error) throw error;

    revalidatePath(`/admin/enquiries/${params.enquiryId}`);
    return { success: true };
  } catch (err) {
    console.error("[Add Note Error]:", err);
    return { success: false, error: "Failed to add internal note." };
  }
}

/**
 * Set follow up date for an enquiry
 */
export async function setEnquiryFollowUpAction(params: {
  id: string;
  followUpDate: string;
  authorName?: string;
  note?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error } = await (supabase.from("enquiries") as any)
      .update({
        follow_up_at: params.followUpDate,
        status: "follow_up",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (error) throw error;

    if (params.note && params.note.trim()) {
      await (supabase.from("enquiry_notes") as any).insert([
        {
          enquiry_id: params.id,
          author_name: params.authorName || "Admin",
          note: `[Follow-up set for ${params.followUpDate}] ${params.note.trim()}`,
        },
      ]);
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${params.id}`);

    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to schedule follow-up." };
  }
}

/**
 * Archive / Unarchive an enquiry
 */
export async function archiveEnquiryAction(params: {
  id: string;
  isArchived: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error } = await (supabase.from("enquiries") as any)
      .update({
        is_archived: params.isArchived,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (error) throw error;

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update archive status." };
  }
}
