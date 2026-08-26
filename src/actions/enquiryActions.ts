"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EnquiryFormData, EnquirySubmissionResult } from "@/types/enquiry";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";

/**
 * Generate a customer-friendly, non-sequential reference ID (e.g. SS-2026-8A42)
 */
function generateReferenceNumber(): string {
  const currentYear = new Date().getFullYear();
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Omits ambiguous chars 0, 1, I, O
  let randomCode = "";
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SS-${currentYear}-${randomCode}`;
}

/**
 * Normalize and validate Indian mobile phone numbers
 */
function isValidIndianMobile(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  // Matches 10-digit number starting with 6-9, or prefixed with 91 or 0
  const indianPhoneRegex = /^(?:91|0)?[6-9]\d{9}$/;
  return indianPhoneRegex.test(cleaned);
}

/**
 * Server Action: Submit Customer Enquiry / Quote / Booking Request
 */
export async function submitEnquiryAction(
  formData: EnquiryFormData
): Promise<EnquirySubmissionResult> {
  try {
    const fieldErrors: Record<string, string> = {};

    // 1. Spam protection honeypot
    if (formData.website_field_hp && formData.website_field_hp.trim().length > 0) {
      // Bot trapped — return simulated success without storing spam
      return {
        success: true,
        referenceNumber: generateReferenceNumber(),
        message: "Your enquiry has been received.",
      };
    }

    // 2. Customer Name Validation
    const name = formData.customerName?.trim() || "";
    if (!name || name.length < 2) {
      fieldErrors.customerName = "Please enter your name (at least 2 characters).";
    } else if (name.length > 100) {
      fieldErrors.customerName = "Name is too long (maximum 100 characters).";
    }

    // 3. Mobile Number Validation
    const mobile = formData.mobileNumber?.trim() || "";
    if (!mobile) {
      fieldErrors.mobileNumber = "Please enter your mobile number.";
    } else if (!isValidIndianMobile(mobile)) {
      fieldErrors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    }

    // 4. Pickup Location & Destination Validation
    const pickup = formData.pickupLocation?.trim() || "Shirdi";
    const destination = formData.destination?.trim() || "";
    if (!pickup) {
      fieldErrors.pickupLocation = "Please specify your pickup location.";
    }
    if (!destination) {
      fieldErrors.destination = "Please specify your destination or tour.";
    }

    // 5. Passenger Count Validation
    const passengers = Number(formData.passengerCount);
    if (isNaN(passengers) || passengers < 1) {
      fieldErrors.passengerCount = "Please enter at least 1 passenger.";
    } else if (passengers > 100) {
      fieldErrors.passengerCount = "Passenger count cannot exceed 100.";
    }

    // 6. Travel Date & Return Date Validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.travelDate) {
      const travelDateObj = new Date(formData.travelDate);
      if (isNaN(travelDateObj.getTime())) {
        fieldErrors.travelDate = "Please select a valid travel date.";
      } else if (travelDateObj < today) {
        fieldErrors.travelDate = "Travel date cannot be in the past.";
      }
    } else if (formData.requestIntent === "booking_request") {
      fieldErrors.travelDate = "Please select your intended travel date.";
    }

    if (formData.returnDate && formData.travelDate) {
      const travelDateObj = new Date(formData.travelDate);
      const returnDateObj = new Date(formData.returnDate);
      if (!isNaN(travelDateObj.getTime()) && !isNaN(returnDateObj.getTime())) {
        if (returnDateObj < travelDateObj) {
          fieldErrors.returnDate = "Return date cannot be earlier than travel date.";
        }
      }
    }

    // If validation fails, return errors
    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        fieldErrors,
        error: "Please correct the highlighted fields before submitting.",
      };
    }

    // Resolve vehicle text if category slug is provided
    let vehiclePreferenceText = "Not Specified";
    if (formData.vehicleCategorySlug) {
      const matchedVeh = VEHICLE_CATEGORIES.find(
        (v) => v.slug === formData.vehicleCategorySlug
      );
      if (matchedVeh) {
        vehiclePreferenceText = matchedVeh.name;
      }
    }

    const referenceNumber = generateReferenceNumber();
    const whatsappNum = formData.sameAsMobile
      ? mobile
      : formData.whatsappNumber?.trim() || mobile;

    // Database record payload
    const enquiryRecord = {
      reference_number: referenceNumber,
      customer_name: name,
      mobile_number: mobile,
      whatsapp_number: whatsappNum,
      email: formData.email?.trim() || null,
      pickup_location: pickup,
      destination: destination,
      trip_type: formData.tripType || "one_way",
      travel_date: formData.travelDate || null,
      return_date: formData.returnDate || null,
      pickup_time: formData.pickupTime?.trim() || null,
      passenger_count: passengers,
      children_count: Number(formData.childrenCount) || 0,
      vehicle_category_slug: formData.vehicleCategorySlug || null,
      vehicle_preference_text: vehiclePreferenceText,
      additional_requirements: formData.additionalRequirements?.trim()?.slice(0, 1500) || null,
      request_intent: formData.requestIntent || "quote",
      enquiry_type: formData.enquiryType || "general",
      source_page: formData.sourcePage?.slice(0, 255) || "direct_quote_form",
      // New Module 9 columns
      landing_page: formData.sourcePage?.slice(0, 500) || null,
      context_type: formData.enquiryType || "general",
      service_slug: formData.serviceSlug || null,
      route_slug: formData.routeSlug || null,
      destination_slug: formData.destinationSlug || null,
      package_slug: formData.packageSlug || null,
      status: "new",
      utm_source: formData.utmSource?.slice(0, 100) || null,
      utm_medium: formData.utmMedium?.slice(0, 100) || null,
      utm_campaign: formData.utmCampaign?.slice(0, 100) || null,
    };

    // Attempt insert to Supabase
    try {
      const supabase = createSupabaseServerClient();
      if (supabase) {
        const { error: dbError } = await (supabase.from("enquiries") as any).insert([enquiryRecord]);
        if (dbError) {
          // Log server-side warning without failing the user experience
          console.warn("[Enquiry Action] Supabase insert warning:", dbError.message);
        }
      }
    } catch (dbErr) {
      console.warn("[Enquiry Action] DB client fallback:", dbErr);
    }

    // Return safe customer confirmation object (NO internal notes or secret IDs)
    return {
      success: true,
      referenceNumber,
      message: "Your enquiry has been received successfully.",
      submittedData: {
        referenceNumber,
        customerName: name,
        pickupLocation: pickup,
        destination,
        travelDate: formData.travelDate,
        passengerCount: passengers,
        vehiclePreference: vehiclePreferenceText,
        requestIntent: formData.requestIntent || "quote",
      },
    };
  } catch (error) {
    console.error("[Enquiry Action Error]:", error);
    return {
      success: false,
      error: "We couldn't send your enquiry right now. Please try again or contact us directly on WhatsApp or phone.",
    };
  }
}
