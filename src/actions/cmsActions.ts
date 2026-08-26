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

    const payload = {
      title: service.title.trim(),
      slug: service.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      service_category: service.serviceCategory || "Outstation",
      short_description: service.shortDescription.trim(),
      full_description: service.fullDescription?.trim() || null,
      icon_name: service.iconName || "Car",
      featured_image_url: service.featuredImageUrl || null,
      image_alt_text: service.imageAltText || null,
      is_featured: Boolean(service.isFeatured),
      status: service.status || "published",
      display_order: Number(service.displayOrder) || 0,
      seo_title: service.seoTitle?.trim() || null,
      meta_description: service.metaDescription?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (service.id && service.id !== "new") {
      const { error } = await (supabase.from("services") as any)
        .update(payload)
        .eq("id", service.id);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("services") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      service.id = data.id;
    }

    revalidatePath("/services");
    revalidatePath("/admin/services");
    if (service.slug) revalidatePath(`/services/${service.slug}`);

    return { success: true, id: service.id };
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

    const payload = {
      name: dest.name.trim(),
      slug: dest.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      origin: dest.origin || "Shirdi",
      distance_km: dest.approxDistanceKm ? Number(dest.approxDistanceKm) : null,
      approx_travel_time: dest.approxTravelTime?.trim() || null,
      short_description: dest.shortDescription.trim(),
      long_description: dest.fullDescription?.trim() || null,
      highlights: dest.highlights || [],
      primary_image_url: dest.primaryImageUrl || null,
      image_alt_text: dest.imageAltText || null,
      is_popular: Boolean(dest.isPopular),
      is_featured: Boolean(dest.isFeatured),
      status: dest.status || "published",
      display_order: Number(dest.displayOrder) || 0,
      seo_title: dest.seoTitle?.trim() || null,
      meta_description: dest.metaDescription?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (dest.id && dest.id !== "new") {
      const { error } = await (supabase.from("destinations") as any)
        .update(payload)
        .eq("id", dest.id);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("destinations") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      dest.id = data.id;
    }

    revalidatePath("/destinations");
    revalidatePath("/admin/destinations");
    if (dest.slug) revalidatePath(`/destinations/${dest.slug}`);

    return { success: true, id: dest.id };
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
      title: row.title,
      slug: row.slug,
      origin: row.origin || "Shirdi",
      destination: row.destination,
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      approxDistanceKm: row.approx_distance_km,
      approxTravelTime: row.approx_travel_time,
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
      metaDescription: row.meta_description,
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
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("routes") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      origin: row.origin || "Shirdi",
      destination: row.destination,
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      approxDistanceKm: row.approx_distance_km,
      approxTravelTime: row.approx_travel_time,
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
      metaDescription: row.meta_description,
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

    const payload = {
      title: route.title.trim(),
      slug: route.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      origin: route.origin || "Shirdi",
      destination: route.destination.trim(),
      short_description: route.shortDescription.trim(),
      full_description: route.fullDescription?.trim() || null,
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
      seo_title: route.seoTitle?.trim() || null,
      meta_description: route.metaDescription?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (route.id && route.id !== "new") {
      const { error } = await (supabase.from("routes") as any)
        .update(payload)
        .eq("id", route.id);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("routes") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      route.id = data.id;
    }

    revalidatePath("/routes");
    revalidatePath("/admin/routes");
    if (route.slug) revalidatePath(`/routes/${route.slug}`);

    return { success: true, id: route.id };
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
      title: row.title,
      slug: row.slug,
      duration: row.duration,
      startingLocation: row.starting_location || "Shirdi",
      destinationsIncluded: row.destinations || [],
      startingFare: row.starting_fare,
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      itinerary: row.itinerary || [],
      inclusions: row.inclusions || [],
      exclusions: row.exclusions || [],
      primaryImageUrl: row.primary_image_url,
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
    console.error("[Get CMS Tours Error]:", err);
    return [];
  }
}

export async function getCMSTourByIdAction(id: string): Promise<CMSTourPackageItem | null> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const { data: row, error } = await (supabase.from("packages") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !row) return null;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      duration: row.duration,
      startingLocation: row.starting_location || "Shirdi",
      destinationsIncluded: row.destinations || [],
      startingFare: row.starting_fare,
      shortDescription: row.short_description,
      fullDescription: row.full_description,
      itinerary: row.itinerary || [],
      inclusions: row.inclusions || [],
      exclusions: row.exclusions || [],
      primaryImageUrl: row.primary_image_url,
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

    const payload = {
      title: tour.title.trim(),
      slug: tour.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      duration: tour.duration.trim(),
      starting_location: tour.startingLocation || "Shirdi",
      destinations: tour.destinationsIncluded || [],
      starting_fare: tour.startingFare ? Number(tour.startingFare) : null,
      short_description: tour.shortDescription.trim(),
      full_description: tour.fullDescription?.trim() || null,
      itinerary: tour.itinerary || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || [],
      primary_image_url: tour.primaryImageUrl || null,
      image_alt_text: tour.imageAltText || null,
      is_featured: Boolean(tour.isFeatured),
      status: tour.status || "published",
      display_order: Number(tour.displayOrder) || 0,
      seo_title: tour.seoTitle?.trim() || null,
      meta_description: tour.metaDescription?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (tour.id && tour.id !== "new") {
      const { error } = await (supabase.from("packages") as any)
        .update(payload)
        .eq("id", tour.id);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("packages") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      tour.id = data.id;
    }

    revalidatePath("/packages");
    revalidatePath("/tours");
    revalidatePath("/admin/tours");
    if (tour.slug) {
      revalidatePath(`/packages/${tour.slug}`);
      revalidatePath(`/tours/${tour.slug}`);
    }

    return { success: true, id: tour.id };
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

    const payload = {
      name: cat.name.trim(),
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
    };

    if (cat.id && cat.id !== "new") {
      const { error } = await (supabase.from("vehicle_categories") as any)
        .update(payload)
        .eq("id", cat.id);
      if (error) throw error;
    } else {
      const { data, error } = await (supabase.from("vehicle_categories") as any)
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;
      cat.id = data.id;
    }

    revalidatePath("/fleet");
    revalidatePath("/admin/fleet");

    return { success: true, id: cat.id };
  } catch (err: any) {
    console.error("[Save Category Error]:", err);
    return { success: false, error: err.message || "Failed to save category." };
  }
}
