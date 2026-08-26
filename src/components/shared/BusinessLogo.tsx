"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BUSINESS_CONFIG } from "@/lib/constants";

export interface BusinessLogoProps {
  size?: "sm" | "md" | "lg" | "icon-only";
  variant?: "header" | "footer" | "admin" | "login" | "light" | "dark";
  customLogoUrl?: string;
  className?: string;
  showTagline?: boolean;
}

export function BusinessLogo({
  size = "md",
  variant = "header",
  customLogoUrl,
  className,
  showTagline = true,
}: BusinessLogoProps) {
  const [imageError, setImageError] = useState(false);

  const isFooter = variant === "footer" || variant === "dark";
  const isLogin = variant === "login";
  const isIconOnly = size === "icon-only";

  const sizeClasses = {
    "icon-only": "w-9 h-9",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const badgeTextClasses = {
    "icon-only": "text-sm",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl",
  };

  const titleClasses = {
    "icon-only": "hidden",
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg",
    lg: "text-xl sm:text-2xl",
  };

  const taglineClasses = {
    "icon-only": "hidden",
    sm: "text-[10px]",
    md: "text-[11px]",
    lg: "text-xs",
  };

  // If custom logo image URL is provided and has not errored
  if (customLogoUrl && !imageError) {
    const imgHeights = {
      "icon-only": 36,
      sm: 32,
      md: 40,
      lg: 56,
    };

    return (
      <div className={cn("inline-flex items-center gap-3 select-none", className)}>
        <div className={cn("relative shrink-0 flex items-center justify-center", sizeClasses[size])}>
          <img
            src={customLogoUrl}
            alt={BUSINESS_CONFIG.name}
            className="max-h-full max-w-full object-contain rounded-md"
            onError={() => setImageError(true)}
          />
        </div>
        {!isIconOnly && (
          <div className="flex flex-col">
            <span
              className={cn(
                "font-extrabold tracking-tight leading-tight uppercase",
                titleClasses[size],
                isFooter ? "text-white" : "text-brand-charcoal-900"
              )}
            >
              {BUSINESS_CONFIG.name}
            </span>
            {showTagline && (
              <span
                className={cn(
                  "font-medium leading-none mt-0.5",
                  taglineClasses[size],
                  isFooter ? "text-brand-saffron-300" : "text-brand-maroon font-semibold"
                )}
              >
                {BUSINESS_CONFIG.tagline}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Authentic Brand Mark Fallback (SS • 2014 • Sai Ashram Shirdi)
  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <div
        className={cn(
          "rounded-xl flex flex-col items-center justify-center font-black transition-all shrink-0 shadow-xs",
          sizeClasses[size],
          isFooter
            ? "bg-brand-maroon text-white border border-brand-maroon-700"
            : isLogin
            ? "bg-brand-maroon text-white border border-brand-maroon-800 shadow-md"
            : "bg-brand-maroon text-white border border-brand-maroon-800"
        )}
      >
        <span className={cn("leading-none font-extrabold", badgeTextClasses[size])}>SS</span>
        {size !== "icon-only" && size !== "sm" && (
          <span className="text-[8px] font-bold text-brand-saffron-300 tracking-wider leading-none mt-0.5">
            2014
          </span>
        )}
      </div>

      {!isIconOnly && (
        <div className="flex flex-col justify-center">
          <span
            className={cn(
              "font-extrabold tracking-tight leading-tight uppercase",
              titleClasses[size],
              isFooter ? "text-white" : "text-brand-charcoal-900"
            )}
          >
            {BUSINESS_CONFIG.name}
          </span>
          {showTagline && (
            <span
              className={cn(
                "leading-none mt-0.5 font-semibold",
                taglineClasses[size],
                isFooter ? "text-brand-saffron-300 font-medium" : "text-brand-maroon"
              )}
            >
              {BUSINESS_CONFIG.tagline} • Sai Ashram Desk
            </span>
          )}
        </div>
      )}
    </div>
  );
}
