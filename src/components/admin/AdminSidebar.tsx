"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  BarChart3,
  Inbox,
  CalendarCheck2,
  Truck,
  Users,
  Layers,
  Car,
  MapPin,
  Route,
  Compass,
  Star,
  HelpCircle,
  Palette,
  Globe,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessLogo } from "@/components/shared/BusinessLogo";

export interface NavGroup {
  groupName: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
  }[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    groupName: "Operations",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Daily Operations", href: "/admin/operations", icon: Clock },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck2 },
    ],
  },
  {
    groupName: "Fleet & Team",
    items: [
      { label: "Vehicles", href: "/admin/vehicles", icon: Truck },
      { label: "Drivers", href: "/admin/drivers", icon: Users },
      { label: "Fleet Catalog", href: "/admin/fleet", icon: Layers },
    ],
  },
  {
    groupName: "Content & CMS",
    items: [
      { label: "Services", href: "/admin/services", icon: Car },
      { label: "Destinations", href: "/admin/destinations", icon: MapPin },
      { label: "Taxi Routes", href: "/admin/routes", icon: Route },
      { label: "Tours & Packages", href: "/admin/tours", icon: Compass },
      { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    groupName: "Configuration",
    items: [
      { label: "Business Branding", href: "/admin/settings/branding", icon: Palette },
      { label: "SEO Health", href: "/admin/seo", icon: Globe },
    ],
  },
];

interface AdminSidebarProps {
  onItemClick?: () => void;
  logoUrl?: string;
  className?: string;
}

export function AdminSidebar({ onItemClick, logoUrl, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col bg-brand-charcoal-900 text-white h-full border-r border-brand-charcoal-800 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-brand-charcoal-800 bg-brand-charcoal-950/60">
        <Link href="/admin/dashboard" onClick={onItemClick} className="block">
          <BusinessLogo
            size="sm"
            variant="admin"
            customLogoUrl={logoUrl}
          />
        </Link>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-stone-700">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-1.5">
              {group.groupName}
            </p>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                      isActive
                        ? "bg-brand-maroon text-white shadow-xs font-bold"
                        : "text-stone-300 hover:text-white hover:bg-brand-charcoal-800/80"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-brand-saffron-300" : "text-stone-400"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Footer Action */}
      <div className="p-3 border-t border-brand-charcoal-800 bg-brand-charcoal-950/60">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-stone-300 hover:text-white hover:bg-brand-charcoal-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-saffron-300" />
            <span className="font-medium">Live Customer Site</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </Link>
      </div>
    </aside>
  );
}
