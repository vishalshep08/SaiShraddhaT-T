"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryPhoto {
  url: string;
  alt: string;
  title?: string;
}

interface DestinationGalleryModalProps {
  images: GalleryPhoto[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
}

export function DestinationGalleryModal({
  images,
  initialIndex,
  isOpen,
  onClose,
  destinationName,
}: DestinationGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 45;
      if (diff > minSwipeDistance) {
        handleNext();
      } else if (diff < -minSwipeDistance) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || images.length === 0) return null;

  const activePhoto = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${destinationName} photo gallery`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Container - Stop propagation on inner clicks */}
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top bar: Counter & Close button */}
        <div className="w-full flex items-center justify-between text-white pb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-stone-300">
              {destinationName}
            </span>
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo gallery"
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Photo Display */}
        <div className="relative w-full aspect-video sm:aspect-16/10 max-h-[72vh] rounded-xl overflow-hidden bg-black/50 shadow-2xl border border-white/10">
          <Image
            src={activePhoto.url}
            alt={activePhoto.alt || `${destinationName} photo`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 85vw, 1200px"
            className="object-contain"
            priority
          />

          {/* Previous Arrow Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Arrow Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Caption & Thumbnails strip */}
        <div className="w-full pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white px-1">
          <p className="text-xs sm:text-sm text-stone-200 truncate">
            {activePhoto.title || activePhoto.alt}
          </p>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-8 rounded overflow-hidden border-2 transition-all shrink-0 ${
                    idx === currentIndex
                      ? "border-brand-gold ring-1 ring-brand-gold scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
