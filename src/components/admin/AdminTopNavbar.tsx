"use client";

import React from "react";
import Link from "next/link";
import { Menu, LogOut, ExternalLink, ShieldCheck, UserCheck } from "lucide-react";
import { AdminProfile } from "@/types/admin";
import { adminLogoutAction } from "@/actions/authActions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BusinessLogo } from "@/components/shared/BusinessLogo";

interface AdminTopNavbarProps {
  user: AdminProfile | null;
  logoUrl?: string;
  onToggleMobileMenu: () => void;
}

export function AdminTopNavbar({ user, logoUrl, onToggleMobileMenu }: AdminTopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 select-none">
      {/* Left: Mobile Drawer Trigger & Workspace Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-brand-charcoal-800 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <BusinessLogo size="sm" variant="mobile" customLogoUrl={logoUrl} />
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Badge variant="maroon" size="sm">
            Shirdi Operations Desk
          </Badge>
          <span className="text-xs text-stone-400 font-medium hidden md:inline">
            • Est. 2014 (Sai Ashram Bhakta Niwas)
          </span>
        </div>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 hover:text-brand-maroon px-2.5 py-1.5 rounded-md hover:bg-stone-100 transition-colors font-medium"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        <div className="h-4 w-px bg-stone-200 hidden sm:block" />

        {/* User Card */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-maroon-50 border border-brand-maroon-200 text-brand-maroon flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-brand-charcoal-900 leading-tight">
              {user?.name || "Ramesh Shep"}
            </span>
            <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider leading-tight">
              {user?.role === "admin" ? "Owner / Admin" : "Staff"}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <form action={adminLogoutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-xs text-stone-600 hover:text-rose-700 hover:bg-rose-50 border-stone-200 h-8"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
