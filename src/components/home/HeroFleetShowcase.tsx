"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { HeroVehicleShowcaseItem } from "@/actions/fleetActions";
import { buildWhatsAppLink } from "@/lib/utils";
import { useEnquiryModal } from "@/context/EnquiryModalContext";

interface HeroFleetShowcaseProps {
  vehicles: HeroVehicleShowcaseItem[];
}

export function HeroFleetShowcase({ vehicles }: HeroFleetShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { openEnquiryModal } = useEnquiryModal();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = vehicles.length;

  // Check reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automatic slow looping (4s) - pauses on interaction or reduced motion
  useEffect(() => {
    if (isPaused || prefersReducedMotion || total <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, prefersReducedMotion, total, nextSlide]);

  // Clean up resume timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Touch Swipe Handlers for mobile with 6s delayed resume
  const handleTouchStart = (e: React.TouchEvent) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const minSwipeDistance = 40;

      if (distance > minSwipeDistance) {
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        prevSlide();
      }
    }

    // Delay autoplay resumption by 6 seconds (6000ms) after touch release
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimeoutRef.current = null;
    }, 6000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  if (total === 0) {
    return null;
  }

  const currentVehicle = vehicles[currentIndex];
  const isOwned = currentVehicle.ownerType === "owned";

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  const imageSrc =
    imageErrorMap[currentVehicle.id] || !currentVehicle.imageUrl
      ? "/images/fleet/ertiga-fallback.svg"
      : currentVehicle.imageUrl;

  return (
    <div
      className="relative w-full focus:outline-none select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Sai Shraddha Tours & Travels Fleet Showcase"
      role="region"
    >
      {/* Showcase Outer Card */}
      <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-md shadow-stone-200/40 relative overflow-hidden flex flex-col justify-between">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
              isOwned
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-stone-100 text-stone-700 border border-stone-200"
            }`}
          >
            {isOwned && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{isOwned ? "Owned Fleet" : "Verified Partner Network"}</span>
          </span>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-400">
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{total}</span>
          </div>
        </div>

        {/* Dynamic Vehicle Image Container */}
        <div className="relative w-full h-44 sm:h-56 rounded-xl bg-stone-50/80 border border-stone-100 overflow-hidden flex items-center justify-center p-2 group">
          <img
            key={currentVehicle.id}
            src={imageSrc}
            alt={currentVehicle.altText}
            onError={() => handleImageError(currentVehicle.id)}
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />

          {/* Quick Prev / Next Controls */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous vehicle"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-brand-maroon hover:text-white transition-all opacity-70 sm:opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next vehicle"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-brand-maroon hover:text-white transition-all opacity-70 sm:opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Short Concise Information (Per Section 7 requirements) */}
        <div className="pt-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <p className="text-base sm:text-lg font-bold text-brand-charcoal-900 tracking-tight">
              {currentVehicle.name}
            </p>
            <span className="text-xs font-semibold text-stone-500">
              {currentVehicle.categoryName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <span>{currentVehicle.seatingCapacity}+1 Seater</span>
            <span className="text-stone-300">•</span>
            <span>AC</span>
            <span className="text-stone-300">•</span>
            <span className={isOwned ? "text-emerald-700 font-semibold" : "text-stone-600"}>
              {isOwned ? "Owned" : "On Request"}
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                openEnquiryModal({
                  vehicleCategorySlug: currentVehicle.name,
                  sourcePage: "hero_fleet_showcase",
                })
              }
              className="text-xs font-bold text-brand-maroon hover:text-brand-maroon-800 flex items-center gap-1 transition-colors"
            >
              <span>Get Fare Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={buildWhatsAppLink({
                vehicle: currentVehicle.name,
                customMessage: `Hello Ramesh Shep, I would like to check availability for ${currentVehicle.name} from Shirdi.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Book Cab</span>
            </a>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {total > 1 && (
          <div className="pt-2.5 flex items-center justify-center gap-1.5">
            {vehicles.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1} - ${v.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-6 bg-brand-maroon"
                    : "w-1.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
