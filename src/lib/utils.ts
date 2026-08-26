import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BUSINESS_CONFIG } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "Custom Quote";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "—";
  const d = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Builds a direct WhatsApp chat link with structured pre-filled enquiry message
 * as requested in PRD Section 25 & Module 1 guidelines.
 */
export function buildWhatsAppLink(params?: {
  pickup?: string;
  drop?: string;
  date?: string;
  passengers?: string | number;
  vehicle?: string;
  customMessage?: string;
  contactName?: string;
}): string {
  const targetNumber = BUSINESS_CONFIG.whatsappRaw;

  if (params?.customMessage) {
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(params.customMessage)}`;
  }

  let text = `Hello ${BUSINESS_CONFIG.name}, I would like to enquire about a cab`;

  if (params?.pickup && params?.drop) {
    text += ` from ${params.pickup} to ${params.drop}`;
  } else if (params?.drop) {
    text += ` for ${params.drop}`;
  } else {
    text += ` from Shirdi`;
  }

  if (params?.passengers) {
    text += ` for ${params.passengers} passenger${Number(params.passengers) > 1 ? "s" : ""}`;
  }

  if (params?.date) {
    text += ` on ${params.date}`;
  }

  if (params?.vehicle) {
    text += ` (Preferred Vehicle: ${params.vehicle})`;
  }

  text += `. Please share availability and quotation.`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
}

export function buildPhoneLink(phoneRaw?: string): string {
  return `tel:${phoneRaw || BUSINESS_CONFIG.primaryPhoneRaw}`;
}
