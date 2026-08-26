import React from "react";
import { Metadata } from "next";
import { getBrandingSettingsAction } from "@/actions/brandingActions";
import { BrandingManager } from "@/components/admin/BrandingManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business Branding & Logo | Admin Workspace",
  description: "Configure global business logo, canonical identity, and visual branding.",
};

export default async function BrandingSettingsPage() {
  const brandingSettings = await getBrandingSettingsAction();

  return <BrandingManager initialSettings={brandingSettings} />;
}
