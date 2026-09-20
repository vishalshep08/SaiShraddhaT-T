"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Maximize2 } from "lucide-react";
import { DestinationGalleryModal, GalleryPhoto } from "./DestinationGalleryModal";

interface DestinationGallerySectionProps {
  images?: GalleryPhoto[];
  destinationName: string;
}

export function DestinationGallerySection({
  images = [],
  destinationName,
}: DestinationGallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-brand-maroon" />
          <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal-900">
            {destinationName} Photo Gallery
          </h2>
        </div>
        <span className="text-xs text-stone-500 font-medium">
          {images.length} {images.length === 1 ? "Photo" : "Photos"}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-stone-600">
        Authentic landmark photography of sacred temples, heritage monuments, and scenic locations along this route. Click any photo to view full size.
      </p>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {images.map((photo, index) => (
          <div
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Expand icon pill */}
            <div className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>

            {/* Photo Title & Caption */}
            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <p className="text-xs sm:text-sm font-semibold truncate leading-snug">
                {photo.title || photo.alt}
              </p>
              <span className="text-[11px] text-stone-300 flex items-center gap-1 mt-0.5">
                Click to expand
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <DestinationGalleryModal
          images={images}
          initialIndex={lightboxIndex}
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          destinationName={destinationName}
        />
      )}
    </section>
  );
}
