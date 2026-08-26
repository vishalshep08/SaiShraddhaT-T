import React from "react";
import { EnquiryStatus } from "@/types/enquiry";
import { Badge } from "@/components/ui/Badge";

interface StatusBadgeProps {
  status: EnquiryStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  switch (status) {
    case "new":
      return (
        <Badge variant="maroon" size={size} className="font-bold">
          ● New
        </Badge>
      );
    case "contacted":
      return (
        <Badge variant="blue" size={size} className="font-semibold">
          Contacted
        </Badge>
      );
    case "quote_discussed":
      return (
        <Badge variant="saffron" size={size} className="font-semibold">
          Quote Discussed
        </Badge>
      );
    case "follow_up":
      return (
        <Badge variant="saffron" size={size} className="font-bold">
          ⏱ Follow-up
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="green" size={size} className="font-bold">
          ✓ Confirmed
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="gray" size={size} className="font-semibold">
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="red" size={size} className="font-semibold">
          Cancelled
        </Badge>
      );
    case "lost":
      return (
        <Badge variant="gray" size={size} className="text-stone-500">
          Lost
        </Badge>
      );
    default:
      return (
        <Badge variant="gray" size={size}>
          {status}
        </Badge>
      );
  }
}
