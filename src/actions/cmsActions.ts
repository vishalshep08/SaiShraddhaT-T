"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  CMSServiceItem,
  CMSDestinationItem,
  CMSRouteItem,
  CMSTourPackageItem,
  CMSVehicleCategoryItem,
  CMSVehicleItem,
  ContentStatus,
} from "@/types/cms";
import { revalidatePath } from "next/cache";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function isUUID(id?: string | null): Promise<boolean> {
  if (!id) return false;
  return UUID_REGEX.test(id);
}

function checkUUID(id?: string | null): boolean {
  if (!id) return false;
  return UUID_REGEX.test(id);
}

// -----------------------------------------------------------------------------
// SERVICES CMS ACTIONS
// -----------------------------------------------------------------------------

export async function getCMSServicesAction(): Promise<CMSServiceItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await (supabase.from("services") as any)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      serviceCategory: row.service_category || "Outstation",
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      iconName: row.icon_name,
      featuredImageUrl: row.featured_image_url,
      imageAltText: row.image_alt_text,
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[Get CMS Services Error]:", err);
    return [];
  }
}

export async function getCMSServiceByIdAction(
  id: string
): Promise<CMSServiceItem | null> {
  try {
    if (!id || !checkUUID(id)) return null;

    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("services") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      serviceCategory: row.service_category || "Outstation",
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      iconName: row.icon_name,
      featuredImageUrl: row.featured_image_url,
      imageAltText: row.image_alt_text,
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    return null;
  }
}

export async function saveCMSServiceAction(service: Partial<CMSServiceItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!service.title?.trim() || !service.slug?.trim() || !service.shortDescription?.trim()) {
      return { success: false, error: "Title, URL slug, and Short description are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const titleVal = service.title.trim();
    const shortDescVal = service.shortDescription.trim();
    const fullDescVal = service.fullDescription?.trim() || shortDescVal;
    const seoTitleVal = service.seoTitle?.trim() || titleVal;
    const metaDescVal = service.metaDescription?.trim() || shortDescVal;

    const payload = {
      title: titleVal,
      slug: service.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      service_category: service.serviceCategory || "Outstation",
      short_description: shortDescVal,
      full_description: fullDescVal,
      icon_name: service.iconName || "Car",
      featured_image_url: service.featuredImageUrl || null,
      image_alt_text: service.imageAltText || null,
      is_featured: Boolean(service.isFeatured),
      status: service.status || "published",
      display_order: Number(service.displayOrder) || 0,
      seo_title: seoTitleVal,
      meta_description: metaDescVal,
      seo_description: metaDescVal,
      is_published: service.status === "published",
      updated_at: new Date().toISOString(),
    };

    let targetId = service.id;

    if (targetId && checkUUID(targetId)) {
      const { error } = await (supabase.from("services") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      // Check if existing record exists with this slug
      const { data: existing } = await (supabase.from("services") as any)
        .select("id")
        .eq("slug", payload.slug)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await (supabase.from("services") as any)
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
        targetId = existing.id;
      } else {
        const { data, error } = await (supabase.from("services") as any)
          .insert([payload])
          .select("id")
          .single();
        if (error) throw error;
        targetId = data.id;
      }
    }

    revalidatePath("/services");
    revalidatePath("/admin/services");
    if (service.slug) revalidatePath(`/services/${service.slug}`);

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Service Error]:", err);
    return { success: false, error: err.message || "Failed to save service." };
  }
}

// -----------------------------------------------------------------------------
// DESTINATIONS CMS ACTIONS
// -----------------------------------------------------------------------------

export async function getCMSDestinationsAction(): Promise<CMSDestinationItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await (supabase.from("destinations") as any)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      origin: row.origin || "Shirdi",
      approxDistanceKm: row.distance_km,
      approxTravelTime: row.approx_travel_time,
      shortDescription: row.short_description,
      fullDescription: row.long_description || row.full_description,
      highlights: row.highlights,
      primaryImageUrl: row.primary_image_url,
      imageAltText: row.image_alt_text,
      isPopular: Boolean(row.is_popular),
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[Get CMS Destinations Error]:", err);
    return [];
  }
}

export async function getCMSDestinationByIdAction(
  id: string
): Promise<CMSDestinationItem | null> {
  try {
    if (!id || !checkUUID(id)) return null;

    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("destinations") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      origin: row.origin || "Shirdi",
      approxDistanceKm: row.distance_km,
      approxTravelTime: row.approx_travel_time,
      shortDescription: row.short_description,
      fullDescription: row.long_description || row.full_description,
      highlights: row.highlights,
      primaryImageUrl: row.primary_image_url,
      imageAltText: row.image_alt_text,
      isPopular: Boolean(row.is_popular),
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    return null;
  }
}

export async function saveCMSDestinationAction(dest: Partial<CMSDestinationItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!dest.name?.trim() || !dest.slug?.trim() || !dest.shortDescription?.trim()) {
      return { success: false, error: "Name, URL slug, and Short description are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const nameVal = dest.name.trim();
    const shortDescVal = dest.shortDescription.trim();
    const fullDescVal = dest.fullDescription?.trim() || shortDescVal;
    const seoTitleVal = dest.seoTitle?.trim() || nameVal;
    const metaDescVal = dest.metaDescription?.trim() || shortDescVal;

    const payload = {
      name: nameVal,
      slug: dest.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      origin: dest.origin || "Shirdi",
      distance_km: dest.approxDistanceKm ? Number(dest.approxDistanceKm) : null,
      approx_travel_time: dest.approxTravelTime?.trim() || null,
      short_description: shortDescVal,
      long_description: fullDescVal,
      full_description: fullDescVal,
      highlights: dest.highlights || [],
      primary_image_url: dest.primaryImageUrl || null,
      image_alt_text: dest.imageAltText || null,
      is_popular: Boolean(dest.isPopular),
      is_featured: Boolean(dest.isFeatured),
      status: dest.status || "published",
      display_order: Number(dest.displayOrder) || 0,
      seo_title: seoTitleVal,
      meta_description: metaDescVal,
      seo_description: metaDescVal,
      is_published: dest.status === "published",
      updated_at: new Date().toISOString(),
    };

    let targetId = dest.id;

    if (targetId && checkUUID(targetId)) {
      const { error } = await (supabase.from("destinations") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data: existing } = await (supabase.from("destinations") as any)
        .select("id")
        .eq("slug", payload.slug)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await (supabase.from("destinations") as any)
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
        targetId = existing.id;
      } else {
        const { data, error } = await (supabase.from("destinations") as any)
          .insert([payload])
          .select("id")
          .single();
        if (error) throw error;
        targetId = data.id;
      }
    }

    revalidatePath("/destinations");
    revalidatePath("/admin/destinations");
    if (dest.slug) revalidatePath(`/destinations/${dest.slug}`);

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Destination Error]:", err);
    return { success: false, error: err.message || "Failed to save destination." };
  }
}

// -----------------------------------------------------------------------------
// ROUTES CMS ACTIONS
// -----------------------------------------------------------------------------

export async function getCMSRoutesAction(): Promise<CMSRouteItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await (supabase.from("routes") as any)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || row.headline,
      slug: row.slug,
      origin: row.origin || "Shirdi",
      destination: row.destination || row.destination_name,
      shortDescription: row.short_description,
      fullDescription: row.full_description || row.route_overview,
      approxDistanceKm: row.approx_distance_km,
      approxTravelTime: row.approx_travel_time || row.approx_duration_text,
      startingFare: row.starting_fare,
      tripType: row.trip_type || "one_way",
      vehicleCategories: row.vehicle_categories || [],
      primaryImageUrl: row.primary_image_url,
      imageAltText: row.image_alt_text,
      isPopular: Boolean(row.is_popular),
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description || row.seo_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[Get CMS Routes Error]:", err);
    return [];
  }
}

export async function getCMSRouteByIdAction(id: string): Promise<CMSRouteItem | null> {
  try {
    if (!id || !checkUUID(id)) return null;

    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("routes") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    return {
      id: row.id,
      title: row.title || row.headline,
      slug: row.slug,
      origin: row.origin || "Shirdi",
      destination: row.destination || row.destination_name,
      shortDescription: row.short_description,
      fullDescription: row.full_description || row.route_overview,
      approxDistanceKm: row.approx_distance_km,
      approxTravelTime: row.approx_travel_time || row.approx_duration_text,
      startingFare: row.starting_fare,
      tripType: row.trip_type || "one_way",
      vehicleCategories: row.vehicle_categories || [],
      primaryImageUrl: row.primary_image_url,
      imageAltText: row.image_alt_text,
      isPopular: Boolean(row.is_popular),
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description || row.seo_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    return null;
  }
}

export async function saveCMSRouteAction(route: Partial<CMSRouteItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!route.title?.trim() || !route.slug?.trim() || !route.destination?.trim() || !route.shortDescription?.trim()) {
      return { success: false, error: "Title, URL slug, Destination, and Short description are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const destName = route.destination.trim();
    const destSlug = destName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const titleVal = route.title.trim();
    const shortDescVal = route.shortDescription.trim();
    const fullDescVal = route.fullDescription?.trim() || shortDescVal;
    const seoTitleVal = route.seoTitle?.trim() || titleVal;
    const metaDescVal = route.metaDescription?.trim() || shortDescVal;

    const payload = {
      // Primary modern columns
      title: titleVal,
      slug: route.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      origin: route.origin || "Shirdi",
      destination: destName,
      short_description: shortDescVal,
      full_description: fullDescVal,
      approx_distance_km: route.approxDistanceKm ? Number(route.approxDistanceKm) : null,
      approx_travel_time: route.approxTravelTime?.trim() || null,
      starting_fare: route.startingFare ? Number(route.startingFare) : null,
      trip_type: route.tripType || "one_way",
      vehicle_categories: route.vehicleCategories || [],
      primary_image_url: route.primaryImageUrl || null,
      image_alt_text: route.imageAltText || null,
      is_popular: Boolean(route.isPopular),
      is_featured: Boolean(route.isFeatured),
      status: route.status || "published",
      display_order: Number(route.displayOrder) || 0,
      seo_title: seoTitleVal,
      meta_description: metaDescVal,

      // Mirror legacy schema columns to prevent NOT-NULL constraint errors on old schemas
      destination_name: destName,
      destination_slug: destSlug || "shirdi-outstation",
      headline: titleVal,
      route_overview: fullDescVal,
      seo_description: metaDescVal,
      approx_distance_text: route.approxDistanceKm ? `${route.approxDistanceKm} km` : null,
      approx_duration_text: route.approxTravelTime?.trim() || null,
      is_published: route.status === "published",

      updated_at: new Date().toISOString(),
    };

    let targetId = route.id;

    if (targetId && checkUUID(targetId)) {
      const { error } = await (supabase.from("routes") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data: existing } = await (supabase.from("routes") as any)
        .select("id")
        .eq("slug", payload.slug)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await (supabase.from("routes") as any)
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
        targetId = existing.id;
      } else {
        const { data, error } = await (supabase.from("routes") as any)
          .insert([payload])
          .select("id")
          .single();
        if (error) throw error;
        targetId = data.id;
      }
    }

    revalidatePath("/routes");
    revalidatePath("/admin/routes");
    if (route.slug) revalidatePath(`/routes/${route.slug}`);

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Route Error]:", err);
    return { success: false, error: err.message || "Failed to save route." };
  }
}

// -----------------------------------------------------------------------------
// TOURS & PACKAGES CMS ACTIONS
// -----------------------------------------------------------------------------

export async function getCMSToursAction(): Promise<CMSTourPackageItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await (supabase.from("packages") as any)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || row.headline,
      slug: row.slug,
      duration: row.duration,
      startingLocation: row.starting_location || "Shirdi",
      destinationsIncluded: row.destinations || [],
      startingFare: row.starting_fare,
      shortDescription: row.short_description,
      fullDescription: row.full_description || row.route_overview,
      itinerary: row.itinerary || [],
      inclusions: row.inclusions || [],
      exclusions: row.exclusions || [],
      primaryImageUrl: row.primary_image_url,
      imageAltText: row.image_alt_text,
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description || row.seo_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[Get CMS Tours Error]:", err);
    return [];
  }
}

export async function getCMSTourByIdAction(id: string): Promise<CMSTourPackageItem | null> {
  try {
    if (!id || !checkUUID(id)) return null;

    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("packages") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    return {
      id: row.id,
      title: row.title || row.headline,
      slug: row.slug,
      duration: row.duration,
      startingLocation: row.starting_location || "Shirdi",
      destinationsIncluded: row.destinations || [],
      startingFare: row.starting_fare,
      shortDescription: row.short_description,
      fullDescription: row.full_description || row.route_overview,
      itinerary: row.itinerary || [],
      inclusions: row.inclusions || [],
      exclusions: row.exclusions || [],
      primaryImageUrl: row.primary_image_url,
      imageAltText: row.image_alt_text,
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      seoTitle: row.seo_title,
      metaDescription: row.meta_description || row.seo_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    return null;
  }
}

export async function saveCMSTourAction(tour: Partial<CMSTourPackageItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!tour.title?.trim() || !tour.slug?.trim() || !tour.duration?.trim() || !tour.shortDescription?.trim()) {
      return { success: false, error: "Title, URL slug, Duration, and Short description are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const titleVal = tour.title.trim();
    const shortDescVal = tour.shortDescription.trim();
    const fullDescVal = tour.fullDescription?.trim() || shortDescVal;
    const seoTitleVal = tour.seoTitle?.trim() || titleVal;
    const metaDescVal = tour.metaDescription?.trim() || shortDescVal;

    const payload = {
      title: titleVal,
      slug: tour.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      duration: tour.duration.trim(),
      starting_location: tour.startingLocation || "Shirdi",
      destinations: tour.destinationsIncluded || [],
      starting_fare: tour.startingFare ? Number(tour.startingFare) : null,
      short_description: shortDescVal,
      full_description: fullDescVal,
      itinerary: tour.itinerary || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || [],
      primary_image_url: tour.primaryImageUrl || null,
      image_alt_text: tour.imageAltText || null,
      is_featured: Boolean(tour.isFeatured),
      status: tour.status || "published",
      display_order: Number(tour.displayOrder) || 0,
      seo_title: seoTitleVal,
      meta_description: metaDescVal,
      seo_description: metaDescVal,
      is_published: tour.status === "published",
      updated_at: new Date().toISOString(),
    };

    let targetId = tour.id;

    if (targetId && checkUUID(targetId)) {
      const { error } = await (supabase.from("packages") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data: existing } = await (supabase.from("packages") as any)
        .select("id")
        .eq("slug", payload.slug)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await (supabase.from("packages") as any)
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
        targetId = existing.id;
      } else {
        const { data, error } = await (supabase.from("packages") as any)
          .insert([payload])
          .select("id")
          .single();
        if (error) throw error;
        targetId = data.id;
      }
    }

    revalidatePath("/packages");
    revalidatePath("/tours");
    revalidatePath("/admin/tours");
    if (tour.slug) {
      revalidatePath(`/packages/${tour.slug}`);
      revalidatePath(`/tours/${tour.slug}`);
    }

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Tour Error]:", err);
    return { success: false, error: err.message || "Failed to save tour package." };
  }
}

// -----------------------------------------------------------------------------
// FLEET & VEHICLE CATEGORIES CMS ACTIONS
// -----------------------------------------------------------------------------

export async function getCMSFleetCategoriesAction(): Promise<CMSVehicleCategoryItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await (supabase.from("vehicle_categories") as any)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      seatingCapacity: row.seating_capacity,
      minPassengers: row.min_passengers,
      maxPassengers: row.max_passengers,
      luggageCapacity: row.luggage_capacity,
      idealFor: row.ideal_for,
      description: row.description,
      availabilityNote: row.availability_note,
      imageUrl: row.image_url,
      imageAltText: row.image_alt_text,
      isFeatured: Boolean(row.is_featured),
      status: (row.status as ContentStatus) || "published",
      displayOrder: row.display_order || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    }));
  } catch (err) {
    console.error("[Get CMS Categories Error]:", err);
    return [];
  }
}

export async function getCMSVehiclesAction(): Promise<CMSVehicleItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await (supabase.from("vehicles") as any)
      .select("*, vehicle_categories(name)")
      .order("display_order", { ascending: true });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      categoryId: row.category_id,
      categoryName: row.vehicle_categories?.name || undefined,
      seatingCapacity: row.seating_capacity,
      ownerType: row.owner_type || "owned",
      status: row.status || "available",
      fuelType: row.fuel_type,
      acType: row.ac_type,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[Get CMS Vehicles Error]:", err);
    return [];
  }
}

export async function saveCMSVehicleCategoryAction(cat: Partial<CMSVehicleCategoryItem>): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    if (!cat.name?.trim() || !cat.slug?.trim() || !cat.seatingCapacity?.trim()) {
      return { success: false, error: "Name, URL slug, and Seating capacity are required." };
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database client unavailable." };

    const nameVal = cat.name.trim();
    const payload = {
      name: nameVal,
      slug: cat.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      seating_capacity: cat.seatingCapacity.trim(),
      min_passengers: Number(cat.minPassengers) || 1,
      max_passengers: Number(cat.maxPassengers) || 4,
      luggage_capacity: cat.luggageCapacity?.trim() || null,
      ideal_for: cat.idealFor?.trim() || null,
      description: cat.description?.trim() || null,
      availability_note: cat.availabilityNote?.trim() || null,
      image_url: cat.imageUrl || null,
      image_alt_text: cat.imageAltText || null,
      is_featured: Boolean(cat.isFeatured),
      status: cat.status || "published",
      display_order: Number(cat.displayOrder) || 0,
      is_published: cat.status === "published",
    };

    let targetId = cat.id;

    if (targetId && checkUUID(targetId)) {
      const { error } = await (supabase.from("vehicle_categories") as any)
        .update(payload)
        .eq("id", targetId);
      if (error) throw error;
    } else {
      const { data: existing } = await (supabase.from("vehicle_categories") as any)
        .select("id")
        .eq("slug", payload.slug)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await (supabase.from("vehicle_categories") as any)
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
        targetId = existing.id;
      } else {
        const { data, error } = await (supabase.from("vehicle_categories") as any)
          .insert([payload])
          .select("id")
          .single();
        if (error) throw error;
        targetId = data.id;
      }
    }

    revalidatePath("/fleet");
    revalidatePath("/admin/fleet");

    return { success: true, id: targetId };
  } catch (err: any) {
    console.error("[Save Category Error]:", err);
    return { success: false, error: err.message || "Failed to save category." };
  }
}
