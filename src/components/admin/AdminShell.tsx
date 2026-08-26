"use client";

import React, { useState } from "react";
import { AdminProfile } from "@/types/admin";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNavbar } from "./AdminTopNavbar";
import { X } from "lucide-react";

interface AdminShellProps {
  user: AdminProfile | null;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-stone-50 text-brand-charcoal-900 overflow-hidden font-sans">
      {/* 1. Desktop Persistent Sidebar (lg+) */}
      <div className="hidden lg:flex lg:w-64 lg:shrink-0 h-full">
        <AdminSidebar className="w-64 h-full" />
      </div>

      {/* 2. Mobile Drawer & Backdrop (< lg) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-brand-charcoal-900 text-white shadow-2xl z-10">
            {/* Close button */}
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AdminSidebar
              onItemClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <AdminTopNavbar
          user={user}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
