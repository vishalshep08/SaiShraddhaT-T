"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useEnquiryModal } from "@/context/EnquiryModalContext";
import { Button } from "@/components/ui/Button";

interface QuoteCTAButtonProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "saffron";
  sourcePage?: string;
}

export function QuoteCTAButton({
  label = "Get a Quote",
  size = "lg",
  className,
  variant = "primary",
  sourcePage = "homepage_cta",
}: QuoteCTAButtonProps) {
  const { openEnquiryModal } = useEnquiryModal();

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() =>
        openEnquiryModal({
          origin: "Shirdi",
          sourcePage,
        })
      }
      rightIcon={<ArrowRight className="w-4 h-4" />}
    >
      {label}
    </Button>
  );
}
