"use client";

import React, { useState, useTransition } from "react";
import { BrandingSettings } from "@/types/branding";
import { updateBrandingSettingsAction, removeLogoAction } from "@/actions/brandingActions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BusinessLogo } from "@/components/shared/BusinessLogo";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  Palette,
  Eye,
} from "lucide-react";

interface BrandingManagerProps {
  initialSettings: BrandingSettings;
}

export function BrandingManager({ initialSettings }: BrandingManagerProps) {
  const [settings, setSettings] = useState<BrandingSettings>(initialSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logoUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState(initialSettings.logoAltText || "Sai Shraddha Tours & Travels, Shirdi");
  const [businessName, setBusinessName] = useState(initialSettings.businessName);
  const [tagline, setTagline] = useState(initialSettings.tagline);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setMessage({ type: "error", text: "Logo image must be under 3MB." });
      return;
    }

    const allowedTypes = ["image/png", "image/webp", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please upload a PNG, WebP, JPEG, or SVG file." });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
    setMessage(null);
  };

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("businessName", businessName);
      formData.set("tagline", tagline);
      formData.set("logoAltText", altText);
      if (settings.logoUrl && !selectedFile) {
        formData.set("existingLogoUrl", settings.logoUrl);
      }
      if (selectedFile) {
        formData.set("logoFile", selectedFile);
      }

      const res = await updateBrandingSettingsAction(formData);
      if (res.success && res.settings) {
        setSettings(res.settings);
        setLogoPreview(res.settings.logoUrl || null);
        setSelectedFile(null);
        setMessage({ type: "success", text: "Business branding & logo updated successfully!" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save branding settings." });
      }
    });
  };

  const handleResetToDefault = () => {
    if (!confirm("Are you sure you want to remove the custom logo and use the default brand mark?")) {
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const res = await removeLogoAction();
      if (res.success) {
        setSettings((prev) => ({ ...prev, logoUrl: undefined, logoStoragePath: undefined }));
        setLogoPreview(null);
        setSelectedFile(null);
        setMessage({ type: "success", text: "Custom logo removed. Default brand mark restored." });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to reset logo." });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand-maroon" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Business Branding & Logo
            </h1>
            <Badge variant="maroon" size="sm">
              Global Brand Config
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage the business logo and branding displayed across the public website and admin workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isPending}
            variant="primary"
            size="md"
            className="font-bold flex items-center gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Branding</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid: Editor Left, Live Previews Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Logo Upload & Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Logo Upload Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-brand-charcoal-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-maroon" />
              Upload Business Logo
            </h2>

            <div className="space-y-3">
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-brand-maroon rounded-2xl cursor-pointer bg-stone-50 hover:bg-brand-maroon-50/30 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-brand-maroon shadow-xs mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-brand-charcoal-900 group-hover:text-brand-maroon">
                  Click to select logo image
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Recommended: Transparent PNG or WebP • Max 3MB
                </p>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/webp,image/jpeg,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {logoPreview && (
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-1 shrink-0">
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-brand-charcoal-900 truncate">
                        {selectedFile ? selectedFile.name : "Custom Logo Active"}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB selected` : "Live on platform"}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleResetToDefault}
                    variant="outline"
                    size="sm"
                    className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200 h-8"
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Remove Logo
                  </Button>
                </div>
              )}
            </div>

            {/* Alt Text */}
            <div className="space-y-1.5 pt-2">
              <label htmlFor="logoAltText" className="text-xs font-bold text-brand-charcoal-900">
                Logo Accessibility Alt Text
              </label>
              <input
                id="logoAltText"
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Sai Shraddha Tours & Travels, Shirdi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
              <p className="text-[11px] text-stone-400">
                Descriptive text read by screen readers and SEO crawlers.
              </p>
            </div>
          </div>

          {/* Business Text Settings Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-brand-charcoal-900">
              Canonical Identity Details
            </h2>

            <div className="space-y-1.5">
              <label htmlFor="bizName" className="text-xs font-bold text-brand-charcoal-900">
                Canonical Business Name
              </label>
              <input
                id="bizName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tagline" className="text-xs font-bold text-brand-charcoal-900">
                Business Tagline / Desk Location
              </label>
              <input
                id="tagline"
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-brand-charcoal-900 bg-white focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Multi-Context Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Eye className="w-4 h-4 text-brand-maroon" />
              <h2 className="text-base font-bold text-brand-charcoal-900">
                Multi-Context Live Previews
              </h2>
            </div>

            {/* Context 1: Public Header (Light background) */}
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                1. Public Website Header (Light)
              </p>
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center">
                <BusinessLogo
                  size="md"
                  variant="header"
                  customLogoUrl={logoPreview || undefined}
                />
              </div>
            </div>

            {/* Context 2: Public Footer (Dark Charcoal background) */}
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                2. Website Footer (Dark)
              </p>
              <div className="p-4 bg-brand-charcoal-900 text-white rounded-xl border border-stone-800 shadow-xs flex items-center">
                <BusinessLogo
                  size="md"
                  variant="footer"
                  customLogoUrl={logoPreview || undefined}
                />
              </div>
            </div>

            {/* Context 3: Admin Sidebar */}
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                3. Admin Sidebar (Compact)
              </p>
              <div className="p-3 bg-brand-charcoal-950 text-white rounded-xl border border-stone-800 shadow-xs flex items-center">
                <BusinessLogo
                  size="sm"
                  variant="admin"
                  customLogoUrl={logoPreview || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
