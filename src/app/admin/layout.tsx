import React from "react";
import { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/actions/authActions";
import { getBrandingSettingsAction } from "@/actions/brandingActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Workspace | Sai Shraddha Tours & Travels",
  description: "Operational Lead Management & Dashboard for Sai Shraddha Tours & Travels, Shirdi.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, branding] = await Promise.all([
    getAdminSession(),
    getBrandingSettingsAction(),
  ]);

  // If user is authenticated, wrap in responsive AdminShell
  if (user) {
    return (
      <AdminShell user={user} logoUrl={branding.logoUrl}>
        {children}
      </AdminShell>
    );
  }

  // Fallback for unauthenticated/login view
  return (
    <div className="min-h-screen bg-stone-100 text-brand-charcoal-900 flex flex-col font-sans">
      {children}
    </div>
  );
}
