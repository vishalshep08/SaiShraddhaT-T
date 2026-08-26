"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react";
import { VehicleImageItem } from "@/types/booking";
import { uploadFleetImageAction } from "@/actions/fleetActions";
import { Button } from "@/components/ui/Button";

interface VehicleImageUploaderProps {
  vehicleId?: string;
  images: VehicleImageItem[];
  onChange: (images: VehicleImageItem[]) => void;
}

export function VehicleImageUploader({
  vehicleId = "new",
  images = [],
  onChange,
}: VehicleImageUploaderProps) {
  const [isUploading, startUploadTransition] = useTransition();
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const file = files[0]; // Process one file at a time or in loop

    const formData = new FormData();
    formData.append("file", file);
    formData.append("vehicleId", vehicleId);

    startUploadTransition(async () => {
      const res = await uploadFleetImageAction(formData);
      if (res.success && res.url) {
        const newImg: VehicleImageItem = {
          id: `img-${Date.now()}`,
          url: res.url,
          altText: "",
          order: images.length + 1,
        };
        const updated = [...images, newImg];
        onChange(updated);
      } else {
        setErrorMsg(res.error || "Failed to upload image.");
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleRemove = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, order: i + 1 }));
    onChange(updated);
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const copy = [...images];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((img, i) => ({ ...img, order: i + 1 }));
    onChange(reordered);
  };

  const handleAltChange = (idx: number, altText: string) => {
    const copy = [...images];
    copy[idx] = { ...copy[idx], altText };
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-brand-maroon bg-brand-maroon-50/50"
            : "border-stone-300 hover:border-brand-maroon/50 hover:bg-stone-50/60 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-maroon-50 text-brand-maroon flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-brand-charcoal-900">
              {isUploading ? "Uploading image to Supabase Storage..." : "Click or drag vehicle photo here"}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Supports WebP, JPG, PNG, AVIF (Max 5MB). The first image will be the primary hero showcase photo.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded Images List & Ordering */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-stone-700">
            Uploaded Photos ({images.length}) — Drag or use arrows to set primary image
          </p>

          <div className="space-y-2.5">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Image Thumbnail */}
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img
                      src={img.url}
                      alt={img.altText || "Vehicle photo"}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-brand-maroon text-white text-[9px] font-bold text-center py-0.5 uppercase tracking-wider">
                        Primary
                      </span>
                    )}
                  </div>

                  {/* Alt Text Input */}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={img.altText || ""}
                      onChange={(e) => handleAltChange(idx, e.target.value)}
                      placeholder="Descriptive Alt Text (e.g. Maruti Ertiga taxi side profile)"
                      className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-maroon"
                    />
                    <p className="text-[10px] text-stone-400">
                      {idx === 0 ? "★ Primary image displayed on Homepage Hero" : `Photo #${idx + 1}`}
                    </p>
                  </div>
                </div>

                {/* Actions: Move Up, Move Down, Delete */}
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-1.5 rounded text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                    title="Move up (make primary)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1.5 rounded text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
                    title="Delete image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
