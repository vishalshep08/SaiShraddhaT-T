"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { EnquiryContextData } from "@/types/enquiry";

interface QuoteButtonProps {
  href?: string;
  variant?: "primary" | "saffron" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  showIcon?: boolean;
  contextData?: EnquiryContextData;
  useModal?: boolean;
}

export function QuoteButton({
  href,
  variant = "primary",
  size = "md",
  className,
  label = "Get a Quote",
  showIcon = true,
  contextData,
  useModal = true,
}: QuoteButtonProps) {
  const { openEnquiryModal } = useEnquiryModal();

  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] select-none shadow-sm cursor-pointer";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-brand-maroon text-white hover:bg-brand-maroon-800 focus-visible:ring-brand-maroon",
    saffron:
      "bg-brand-saffron text-white hover:bg-brand-saffron-600 focus-visible:ring-brand-saffron",
    outline:
      "border border-brand-maroon bg-white text-brand-maroon hover:bg-brand-maroon-50 focus-visible:ring-brand-maroon",
  };

  const combinedClass = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (useModal && !href) {
    return (
      <button
        type="button"
        onClick={() => openEnquiryModal(contextData)}
        className={combinedClass}
      >
        <span>{label}</span>
        {showIcon && <ArrowRight className="w-4 h-4 shrink-0" />}
      </button>
    );
  }

  return (
    <Link href={href || "/get-quote"} className={combinedClass}>
      <span>{label}</span>
      {showIcon && <ArrowRight className="w-4 h-4 shrink-0" />}
    </Link>
  );
}
