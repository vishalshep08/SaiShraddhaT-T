import React from "react";
import { Phone } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants";
import { buildPhoneLink, cn } from "@/lib/utils";

interface CallButtonProps {
  contactName?: string;
  phoneNumber?: string;
  phoneRaw?: string;
  variant?: "primary" | "outline" | "subtle";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function CallButton({
  contactName,
  phoneNumber,
  phoneRaw,
  variant = "outline",
  size = "md",
  className,
  label,
}: CallButtonProps) {
  let targetPhone = phoneNumber || BUSINESS_CONFIG.primaryPhone;
  let targetRaw = phoneRaw || BUSINESS_CONFIG.primaryPhoneRaw;

  if (contactName) {
    const contact = BUSINESS_CONFIG.contacts.find(
      (c) => c.name.toLowerCase() === contactName.toLowerCase()
    );
    if (contact) {
      targetPhone = contact.primaryPhone;
      targetRaw = contact.primaryPhoneRaw;
    }
  }

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] select-none";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs gap-1.5",
    md: "h-11 px-4 text-sm gap-2",
    lg: "h-12 px-5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-brand-maroon text-white hover:bg-brand-maroon-800 focus-visible:ring-brand-maroon shadow-sm",
    outline:
      "border border-stone-300 bg-white text-brand-charcoal-900 hover:bg-stone-50 hover:border-stone-400 focus-visible:ring-brand-maroon",
    subtle:
      "bg-brand-ivory-200/80 text-brand-charcoal-800 hover:bg-brand-ivory-300 focus-visible:ring-stone-400",
  };

  const displayText =
    label || (contactName ? `Call ${contactName}: ${targetPhone}` : `Call ${targetPhone}`);

  return (
    <a
      href={buildPhoneLink(targetRaw)}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
    >
      <Phone className="w-4 h-4 text-brand-maroon shrink-0" />
      <span>{displayText}</span>
    </a>
  );
}
