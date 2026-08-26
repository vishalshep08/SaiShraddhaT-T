"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VehicleItem, VehicleImageItem } from "@/types/booking";
import { revalidatePath } from "next/cache";

export interface HeroVehicleShowcaseItem {
  id: string;
  name: string;
  displayName: string;
  categoryName: string;
  seatingCapacity: number;
  ownerType: "owned" | "partner_network";
  imageUrl?: string;
  images: VehicleImageItem[];
  altText: string;
  description?: string;
  displayOrder: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT HERO SHOWCASE FALLBACK (Used if no vehicles exist in DB yet)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_HERO_FLEET: HeroVehicleShowcaseItem[] = [
  {
    id: "default-ertiga",
    name: "Maruti Suzuki Ertiga",
    displayName: "Maruti Suzuki Ertiga (Owned Fleet)",
    categoryName: "SUV / MUV (6+1 Seater)",
    seatingCapacity: 6,
    ownerType: "owned",
    imageUrl: "/images/fleet/ertiga-fallback.svg",
    images: [
      {
        id: "img-1",
        url: "/images/fleet/ertiga-fallback.svg",
        altText: "Maruti Suzuki Ertiga taxi for Shirdi pilgrimage & outstation travel",
        order: 1,
      },
    ],
    altText: "Maruti Suzuki Ertiga taxi available for Shirdi pilgrimage travel",
    description: "Our primary owned fleet. Pristine cleanliness, dual AC, and comfortable middle-row pushback seats.",
    displayOrder: 1,
  },
  {
    id: "default-tavera",
    name: "Chevrolet Tavera",
    displayName: "Chevrolet Tavera (Owned Fleet)",
    categoryName: "MUV (7/8+1 Seater)",
    seatingCapacity: 8,
    ownerType: "owned",
    imageUrl: "/images/fleet/tavera-fallback.svg",
    images: [
      {
        id: "img-2",
        url: "/images/fleet/tavera-fallback.svg",
        altText: "Chevrolet Tavera high-capacity cab for large family temple yatra",
        order: 1,
      },
    ],
    altText: "Chevrolet Tavera MUV for large family darshan and joint yatra",
    description: "High ground clearance, roof luggage carrier, and extra cabin space for large joint family tours.",
    displayOrder: 2,
  },
  {
    id: "default-sedan",
    name: "Swift Dzire / Sedan",
    displayName: "Sedan (Swift Dzire / Etios)",
    categoryName: "Sedan (4+1 Seater)",
    seatingCapacity: 4,
    ownerType: "partner_network",
    imageUrl: "/images/fleet/sedan-fallback.svg",
    images: [
      {
        id: "img-3",
        url: "/images/fleet/sedan-fallback.svg",
        altText: "Air-conditioned sedan cab for couples and small family travel",
        order: 1,
      },
    ],
    altText: "Clean sedan cab available on request for quick Shirdi airport transfers",
    description: "Available on request through our verified driver network for couples and quick airport transfers.",
    displayOrder: 3,
  },
  {
    id: "default-tempo",
    name: "Tempo Traveller",
    displayName: "Tempo Traveller (13–26 Seater)",
    categoryName: "Group Van (13 to 26 Seats)",
    seatingCapacity: 17,
    ownerType: "partner_network",
    imageUrl: "/images/fleet/tempo-fallback.svg",
    images: [
      {
        id: "img-4",
        url: "/images/fleet/tempo-fallback.svg",
        altText: "Luxury Tempo Traveller with pushback seats for Shirdi group yatra",
        order: 1,
      },
    ],
    altText: "Tempo Traveller arranged for large family and pilgrimage groups",
    description: "Pushback reclining seats, mic system, and large luggage hold for group pilgrimage journeys.",
    displayOrder: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HERO FLEET SHOWCASE PUBLIC ACTION
// ─────────────────────────────────────────────────────────────────────────────

export async function getHeroFleetShowcaseAction(): Promise<HeroVehicleShowcaseItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return DEFAULT_HERO_FLEET;

    const { data, error } = await (supabase.from("vehicles") as any)
      .select("*, vehicle_categories(name)")
      .eq("show_in_hero", true)
      .neq("status", "inactive")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_HERO_FLEET;
    }

    return data.map((row: any) => {
      let parsedImages: VehicleImageItem[] = [];
      try {
        if (Array.isArray(row.images)) {
          parsedImages = row.images;
        } else if (typeof row.images === "string") {
          parsedImages = JSON.parse(row.images);
        }
      } catch {
        parsedImages = [];
      }

      const primaryUrl =
        parsedImages.length > 0
          ? parsedImages[0].url
          : row.image_url || "/images/fleet/ertiga-fallback.svg";

      const defaultAlt = `${row.display_name || row.name} taxi available in Shirdi for pilgrimage and travel`;

      return {
        id: row.id,
        name: row.name,
        displayName: row.display_name || row.name,
        categoryName:
          row.category_name ||
          row.vehicle_categories?.name ||
          `${row.seating_capacity || 6} Seater ${row.name}`,
        seatingCapacity: Number(row.seating_capacity) || 6,
        ownerType: (row.owner_type as "owned" | "partner_network") || "owned",
        imageUrl: primaryUrl,
        images: parsedImages,
        altText: row.alt_text || (parsedImages[0]?.altText) || defaultAlt,
        description: row.description || row.notes || undefined,
        displayOrder: Number(row.display_order) || 0,
      };
    });
  } catch (err) {
    console.error("[Get Hero Fleet Showcase Error]:", err);
    return DEFAULT_HERO_FLEET;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN STORAGE & SHOWCASE ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function toggleHeroShowcaseAction(params: {
  id: string;
  showInHero: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await (supabase.from("vehicles") as any)
      .update({ show_in_hero: params.showInHero, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (error) throw error;

    revalidatePath("/admin/vehicles");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update showcase status." };
  }
}

/**
 * Upload an image file to Supabase Storage bucket 'fleet-images'
 */
export async function uploadFleetImageAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}> {
  try {
    const file = formData.get("file") as File;
    const vehicleId = (formData.get("vehicleId") as string) || "general";

    if (!file) {
      return { success: false, error: "No file provided for upload." };
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Image file size must be less than 5MB." };
    }

    // Validate MIME type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
    if (!validMimes.includes(file.type)) {
      return { success: false, error: "Only JPEG, PNG, WebP, AVIF, and SVG images are supported." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return { success: false, error: "Database client unavailable." };
    }

    // Generate unique storage path: vehicle-id/timestamp-random.ext
    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const storagePath = `${vehicleId}/${timestamp}-${randomStr}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("fleet-images")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      // If bucket does not exist in local dev yet, return a safe message
      console.error("[Storage Upload Error]:", uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("fleet-images")
      .getPublicUrl(storagePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: storagePath,
    };
  } catch (err: any) {
    console.error("[Upload Fleet Image Error]:", err);
    return { success: false, error: err.message || "Failed to upload image." };
  }
}

/**
 * Delete an image file from Supabase Storage bucket 'fleet-images'
 */
export async function deleteFleetImageAction(filePath: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const { error } = await supabase.storage.from("fleet-images").remove([filePath]);
    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete image." };
  }
}
