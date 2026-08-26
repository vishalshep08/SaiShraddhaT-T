import React from "react";
import { MessageSquare } from "lucide-react";
import { buildWhatsAppLink, cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  dropLocation?: string;
  pickupLocation?: string;
  passengers?: number | string;
  vehicle?: string;
  customMessage?: string;
  contactName?: string;
  variant?: "primary" | "outline" | "subtle";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function WhatsAppButton({
  dropLocation,
  pickupLocation,
  passengers,
  vehicle,
  customMessage,
  contactName,
  variant = "primary",
  size = "md",
  className,
  label = "WhatsApp Us",
}: WhatsAppButtonProps) {
  const whatsappUrl = buildWhatsAppLink({
    drop: dropLocation,
    pickup: pickupLocation,
    passengers,
    vehicle,
    customMessage,
    contactName,
  });

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] select-none";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-sm",
    outline:
      "border border-emerald-600 bg-transparent text-emerald-800 hover:bg-emerald-50 focus-visible:ring-emerald-500",
    subtle:
      "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 focus-visible:ring-emerald-500",
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
    >
      <MessageSquare className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </a>
  );
}
