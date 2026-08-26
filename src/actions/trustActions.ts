"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ReviewItem,
  ReviewSource,
  ReviewStatus,
  FAQItem,
  FAQCategory,
  FAQStatus,
  SiteSettings,
} from "@/types/trust";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// ROW MAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function mapReviewRow(row: any): ReviewItem {
  return {
    id: row.id,
    customerDisplayName: row.customer_display_name || "Verified Customer",
    reviewText: row.review_text || "",
    rating: Number(row.rating) || 5,
    source: (row.source as ReviewSource) || "google",
    reviewDate: row.review_date || row.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
    serviceName: row.service_name || undefined,
    destinationName: row.destination_name || undefined,
    isVerified: Boolean(row.is_verified),
    isFeatured: Boolean(row.is_featured),
    displayOrder: Number(row.display_order) || 0,
    status: (row.status as ReviewStatus) || "draft",
    originalUrl: row.original_url || undefined,
    imageUrl: row.image_url || undefined,
    imageAltText: row.image_alt_text || undefined,
    hasPhotoConsent: Boolean(row.has_photo_consent),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFAQRow(row: any): FAQItem {
  return {
    id: row.id,
    question: row.question || "",
    answer: row.answer || "",
    category: (row.category as FAQCategory) || "general",
    contextType: row.context_type || undefined,
    contextSlug: row.context_slug || undefined,
    displayOrder: Number(row.display_order) || 0,
    status: (row.status as FAQStatus) || "published",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getSiteSettingsAction(): Promise<SiteSettings> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return {};

    const { data, error } = await (supabase.from("site_settings") as any).select("*");
    if (error || !data) return {};

    const settings: SiteSettings = {};
    data.forEach((row: any) => {
      if (row.key === "google_review_url") settings.googleReviewUrl = row.value || undefined;
      if (row.key === "google_business_profile_url") settings.googleBusinessProfileUrl = row.value || undefined;
      if (row.key === "trust_headline") settings.trustHeadline = row.value || undefined;
    });

    return settings;
  } catch (err) {
    console.error("[Get Site Settings Error]:", err);
    return {};
  }
}

export async function saveSiteSettingAction(
  key: string,
  value: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await (supabase.from("site_settings") as any).upsert(
      {
        key,
        value: value.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) throw error;

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    console.error("[Save Site Setting Error]:", err);
    return { success: false, error: err.message || "Failed to save site setting." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC REVIEWS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getPublicReviewsAction(options?: {
  limit?: number;
  featuredOnly?: boolean;
  serviceName?: string;
  destinationName?: string;
}): Promise<ReviewItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    let query = (supabase.from("reviews") as any)
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("review_date", { ascending: false });

    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }

    if (options?.serviceName) {
      query = query.eq("service_name", options.serviceName);
    }

    if (options?.destinationName) {
      query = query.eq("destination_name", options.destinationName);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapReviewRow);
  } catch (err) {
    console.error("[Get Public Reviews Error]:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC FAQS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getPublicFAQsAction(options?: {
  category?: FAQCategory;
  contextType?: string;
  contextSlug?: string;
  limit?: number;
}): Promise<FAQItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    let query = (supabase.from("faqs") as any)
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.contextType) {
      query = query.eq("context_type", options.contextType);
    }

    if (options?.contextSlug) {
      query = query.eq("context_slug", options.contextSlug);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapFAQRow);
  } catch (err) {
    console.error("[Get Public FAQs Error]:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN REVIEWS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAdminReviewsAction(params?: {
  status?: string;
  search?: string;
}): Promise<ReviewItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    let query = (supabase.from("reviews") as any)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (params?.status && params.status !== "all") {
      if (params.status === "featured") {
        query = query.eq("is_featured", true);
      } else {
        query = query.eq("status", params.status);
      }
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      query = query.or(`customer_display_name.ilike.%${q}%,review_text.ilike.%${q}%,destination_name.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapReviewRow);
  } catch (err) {
    console.error("[Get Admin Reviews Error]:", err);
    return [];
  }
}

export async function getAdminReviewByIdAction(id: string): Promise<ReviewItem | null> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await (supabase.from("reviews") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapReviewRow(data);
  } catch (err) {
    return null;
  }
}

export async function saveReviewAction(review: Partial<ReviewItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!review.customerDisplayName?.trim() || !review.reviewText?.trim()) {
      return { success: false, error: "Customer display name and review text are required." };
    }

    const rating = Number(review.rating);
    if (!rating || rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5 stars." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const isNew = !review.id || review.id === "new";

    const payload: any = {
      customer_display_name: review.customerDisplayName.trim(),
      review_text: review.reviewText.trim(),
      rating,
      source: review.source || "google",
      review_date: review.reviewDate || new Date().toISOString().split("T")[0],
      service_name: review.serviceName?.trim() || null,
      destination_name: review.destinationName?.trim() || null,
      is_verified: Boolean(review.isVerified),
      is_featured: Boolean(review.isFeatured),
      display_order: Number(review.displayOrder) || 0,
      status: review.status || "published",
      original_url: review.originalUrl?.trim() || null,
      image_url: review.imageUrl?.trim() || null,
      image_alt_text: review.imageAltText?.trim() || null,
      has_photo_consent: Boolean(review.hasPhotoConsent),
      updated_at: new Date().toISOString(),
    };

    let targetId = review.id;

    if (!isNew && targetId) {
      const { error } = await (supabase.from("reviews") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("reviews") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      targetId = data.id;
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Review Error]:", err);
    return { success: false, error: err.message || "Failed to save review." };
  }
}

export async function toggleReviewStatusAction(params: {
  id: string;
  status: ReviewStatus;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await (supabase.from("reviews") as any)
      .update({ status: params.status, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (error) throw error;

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update review status." };
  }
}

export async function toggleReviewFeaturedAction(params: {
  id: string;
  isFeatured: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await (supabase.from("reviews") as any)
      .update({ is_featured: params.isFeatured, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (error) throw error;

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update featured status." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN FAQS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAdminFAQsAction(params?: {
  category?: string;
  status?: string;
  search?: string;
}): Promise<FAQItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    let query = (supabase.from("faqs") as any)
      .select("*")
      .order("category", { ascending: true })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (params?.category && params.category !== "all") {
      query = query.eq("category", params.category);
    }

    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      query = query.or(`question.ilike.%${q}%,answer.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapFAQRow);
  } catch (err) {
    console.error("[Get Admin FAQs Error]:", err);
    return [];
  }
}

export async function getAdminFAQByIdAction(id: string): Promise<FAQItem | null> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await (supabase.from("faqs") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapFAQRow(data);
  } catch (err) {
    return null;
  }
}

export async function saveFAQAction(faq: Partial<FAQItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!faq.question?.trim() || !faq.answer?.trim()) {
      return { success: false, error: "Question and answer are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const isNew = !faq.id || faq.id === "new";

    const payload: any = {
      question: faq.question.trim(),
      answer: faq.answer.trim(),
      category: faq.category || "general",
      context_type: faq.contextType || null,
      context_slug: faq.contextSlug?.trim() || null,
      display_order: Number(faq.displayOrder) || 0,
      status: faq.status || "published",
      updated_at: new Date().toISOString(),
    };

    let targetId = faq.id;

    if (!isNew && targetId) {
      const { error } = await (supabase.from("faqs") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("faqs") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      targetId = data.id;
    }

    revalidatePath("/admin/faqs");
    revalidatePath("/reviews");
    revalidatePath("/");

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save FAQ Error]:", err);
    return { success: false, error: err.message || "Failed to save FAQ." };
  }
}

export async function toggleFAQStatusAction(params: {
  id: string;
  status: FAQStatus;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await (supabase.from("faqs") as any)
      .update({ status: params.status, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (error) throw error;

    revalidatePath("/admin/faqs");
    revalidatePath("/reviews");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to update FAQ status." };
  }
}
