"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BrandingSettings, DEFAULT_BRANDING } from "@/types/branding";
import { getAdminSession } from "./authActions";
import { revalidatePath } from "next/cache";

/**
 * Fetch global branding & logo settings
 */
export async function getBrandingSettingsAction(): Promise<BrandingSettings> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return DEFAULT_BRANDING;

    const { data, error } = await (supabase.from("business_settings") as any)
      .select("setting_value, updated_at")
      .eq("setting_key", "branding")
      .single();

    if (error || !data?.setting_value) {
      return DEFAULT_BRANDING;
    }

    const val = data.setting_value as any;
    return {
      businessName: val.business_name || DEFAULT_BRANDING.businessName,
      tagline: val.tagline || DEFAULT_BRANDING.tagline,
      establishedYear: val.established_year || DEFAULT_BRANDING.establishedYear,
      logoUrl: val.logo_url || undefined,
      logoStoragePath: val.logo_storage_path || undefined,
      logoAltText: val.logo_alt_text || DEFAULT_BRANDING.logoAltText,
      updatedAt: data.updated_at || undefined,
    };
  } catch (err) {
    return DEFAULT_BRANDING;
  }
}

/**
 * Update global branding and upload/replace logo in Supabase Storage
 */
export async function updateBrandingSettingsAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  settings?: BrandingSettings;
}> {
  try {
    // 1. Authorize admin
    const user = await getAdminSession();
    if (!user) {
      return { success: false, error: "Unauthorized. Please sign in as an administrator." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return { success: false, error: "Database client is unavailable." };
    }

    const businessName = (formData.get("businessName") as string)?.trim() || DEFAULT_BRANDING.businessName;
    const tagline = (formData.get("tagline") as string)?.trim() || DEFAULT_BRANDING.tagline;
    const logoAltText = (formData.get("logoAltText") as string)?.trim() || DEFAULT_BRANDING.logoAltText;
    const existingLogoUrl = (formData.get("existingLogoUrl") as string)?.trim();
    const logoFile = formData.get("logoFile") as File | null;

    let finalLogoUrl = existingLogoUrl || "";
    let finalStoragePath = "";

    // 2. Handle file upload if provided
    if (logoFile && logoFile.size > 0 && typeof logoFile.name === "string") {
      // Validate file size (max 3MB)
      if (logoFile.size > 3 * 1024 * 1024) {
        return { success: false, error: "Logo file size must be less than 3MB." };
      }

      // Validate MIME type
      const allowedMimeTypes = ["image/png", "image/webp", "image/jpeg", "image/jpg", "image/svg+xml"];
      if (!allowedMimeTypes.includes(logoFile.type)) {
        return { success: false, error: "Invalid image format. Allowed: PNG, WebP, JPEG, SVG." };
      }

      const fileExt = logoFile.name.split(".").pop()?.toLowerCase() || "webp";
      const timestamp = Date.now();
      const fileName = `logo-${timestamp}.${fileExt}`;
      const storagePath = `branding/${fileName}`;

      try {
        const fileBuffer = await logoFile.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("branding")
          .upload(storagePath, fileBuffer, {
            contentType: logoFile.type,
            upsert: true,
          });

        if (!uploadError && uploadData) {
          finalStoragePath = uploadData.path;
          const { data: publicUrlData } = supabase.storage
            .from("branding")
            .getPublicUrl(uploadData.path);

          // Add cache-busting timestamp version
          finalLogoUrl = `${publicUrlData.publicUrl}?v=${timestamp}`;
        }
      } catch (storageErr) {
        console.warn("[Storage Upload Warning]:", storageErr);
      }
    }

    // 3. Save to database
    const payload = {
      business_name: businessName,
      tagline: tagline,
      established_year: 2014,
      logo_url: finalLogoUrl || null,
      logo_storage_path: finalStoragePath || null,
      logo_alt_text: logoAltText,
    };

    const { error: upsertError } = await (supabase.from("business_settings") as any).upsert(
      {
        setting_key: "branding",
        setting_value: payload,
        description: "Global business branding, logo and visual identity configuration",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "setting_key" }
    );

    if (upsertError) {
      console.warn("[Branding Upsert Warning]:", upsertError);
    }

    // Revalidate all pages consuming the logo
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    return {
      success: true,
      settings: {
        businessName,
        tagline,
        establishedYear: 2014,
        logoUrl: finalLogoUrl || undefined,
        logoStoragePath: finalStoragePath || undefined,
        logoAltText,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update branding settings." };
  }
}

/**
 * Remove custom logo and restore standard brand mark
 */
export async function removeLogoAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getAdminSession();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const payload = {
      business_name: DEFAULT_BRANDING.businessName,
      tagline: DEFAULT_BRANDING.tagline,
      established_year: 2014,
      logo_url: null,
      logo_storage_path: null,
      logo_alt_text: DEFAULT_BRANDING.logoAltText,
    };

    await (supabase.from("business_settings") as any).upsert(
      {
        setting_key: "branding",
        setting_value: payload,
        description: "Global business branding, logo and visual identity configuration",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "setting_key" }
    );

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to remove logo." };
  }
}
