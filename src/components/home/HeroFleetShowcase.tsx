"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { HeroVehicleShowcaseItem } from "@/actions/fleetActions";
import { buildWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface HeroFleetShowcaseProps {
  vehicles: HeroVehicleShowcaseItem[];
}

export function HeroFleetShowcase({ vehicles }: HeroFleetShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = vehicles.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automatic slow looping (4.5 seconds per slide)
  useEffect(() => {
    if (isPaused || total <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total, nextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setIsPaused(false);
  };

  // Keyboard navigation
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
      className="relative w-full focus:outline-none"
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
      <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-lg shadow-stone-200/50 relative overflow-hidden flex flex-col justify-between transition-all duration-300">
        {/* Top Header Strip: Fleet badge & Slide Counter */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                isOwned
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {isOwned && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isOwned ? "Directly Owned Fleet" : "Available On Request"}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-400">
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{total}</span>
          </div>
        </div>

        {/* Dynamic Vehicle Image Container with Smooth Fade */}
        <div className="relative w-full h-48 sm:h-64 rounded-2xl bg-stone-50/80 border border-stone-100 overflow-hidden flex items-center justify-center p-2 group">
          <img
            key={currentVehicle.id}
            src={imageSrc}
            alt={currentVehicle.altText}
            onError={() => handleImageError(currentVehicle.id)}
            className="w-full h-full object-contain rounded-xl transition-all duration-500 transform group-hover:scale-[1.02]"
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />

          {/* Quick Prev / Next Controls on Image Hover */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous vehicle"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-brand-maroon hover:text-white transition-all opacity-80 sm:opacity-0 group-hover:opacity-100"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-brand-maroon hover:text-white transition-all opacity-80 sm:opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Vehicle Information Details */}
        <div className="pt-4 space-y-2">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-black text-brand-charcoal-900 tracking-tight">
              {currentVehicle.displayName}
            </h2>
            <span className="text-xs font-bold text-brand-maroon">
              {currentVehicle.categoryName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-600">
            <span className="flex items-center gap-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
              <span>{currentVehicle.seatingCapacity} Seater</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">Air Conditioned</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">Clean &amp; Sanitized</span>
          </div>

          {currentVehicle.description && (
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed pt-0.5">
              {currentVehicle.description}
            </p>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
            <a
              href={`#quick-enquiry`}
              className="text-xs font-bold text-brand-maroon hover:text-brand-maroon-800 flex items-center gap-1 transition-colors"
            >
              <span>Get Fare Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={buildWhatsAppLink({ vehicle: currentVehicle.name })}
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
          <div className="pt-3 flex items-center justify-center gap-1.5">
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
