"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { DEFAULT_BRANDING } from "@/types/branding";

export interface BusinessLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "icon-only";
  variant?: "header" | "mobile" | "footer" | "admin" | "login" | "icon-only" | "print";
  customLogoUrl?: string;
  customEmblemUrl?: string;
  className?: string;
  showTagline?: boolean;
  priority?: boolean;
}

export function BusinessLogo({
  size = "md",
  variant = "header",
  customLogoUrl,
  customEmblemUrl,
  className,
  showTagline = true,
  priority = false,
}: BusinessLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Active logo URLs with official defaults
  const activeLogoUrl = customLogoUrl || DEFAULT_BRANDING.logoUrl || "/images/branding/official-logo.png";
  const activeEmblemUrl = customEmblemUrl || DEFAULT_BRANDING.emblemUrl || "/images/branding/logo-emblem.png";

  const isIconOnly = size === "icon-only" || variant === "icon-only";

  // 1. Icon-Only Mode (Circular Sai Baba Emblem Mark)
  if (isIconOnly) {
    const iconDimensions = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
      "icon-only": "w-10 h-10",
    };

    return (
      <div
        className={cn(
          "relative shrink-0 rounded-full overflow-hidden border border-brand-maroon/20 bg-white shadow-xs flex items-center justify-center select-none",
          iconDimensions[size],
          className
        )}
      >
        <img
          src={activeEmblemUrl}
          alt={DEFAULT_BRANDING.logoAltText || "Sai Shraddha Tours & Travels - Shirdi"}
          className="w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // 2. Full Brand Logo (Preserving Exact Master Aspect Ratio)
  if (!imageError) {
    let containerStyle = "h-11 sm:h-12 w-auto max-w-[260px] sm:max-w-[300px]";

    if (variant === "mobile") {
      containerStyle = "h-9 w-auto max-w-[210px]";
    } else if (variant === "footer") {
      containerStyle = "h-14 sm:h-16 w-auto max-w-[300px] bg-white/95 p-1.5 rounded-xl border border-stone-700 shadow-sm";
    } else if (variant === "admin") {
      containerStyle = "h-9 w-auto max-w-[190px] bg-white/90 p-1 rounded-lg";
    } else if (variant === "login") {
      containerStyle = "h-20 sm:h-24 w-auto max-w-[360px] mx-auto";
    } else if (variant === "print") {
      containerStyle = "h-14 w-auto max-w-[280px]";
    }

    return (
      <div className={cn("inline-flex items-center select-none", className)}>
        <img
          src={activeLogoUrl}
          alt={DEFAULT_BRANDING.logoAltText || "Sai Shraddha Tours & Travels - Shirdi (Serving Since 2014)"}
          className={cn("object-contain", containerStyle)}
          loading={priority ? "eager" : "lazy"}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // 3. Graceful Fallback if image asset fails to load
  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div className="w-10 h-10 rounded-xl bg-brand-maroon text-white flex items-center justify-center font-extrabold text-sm border border-brand-maroon-700 shrink-0 shadow-xs">
        SS
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-base tracking-tight leading-tight uppercase text-brand-charcoal-900">
          {BUSINESS_CONFIG.name}
        </span>
        <span className="text-[11px] font-semibold text-brand-maroon leading-none mt-0.5">
          {BUSINESS_CONFIG.tagline}
        </span>
      </div>
    </div>
  );
}
