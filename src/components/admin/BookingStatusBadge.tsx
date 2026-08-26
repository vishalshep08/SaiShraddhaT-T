import React from "react";
import { BookingStatus } from "@/types/booking";
import { Badge } from "@/components/ui/Badge";

interface BookingStatusBadgeProps {
  status: BookingStatus | string;
  size?: "sm" | "md";
}

export function BookingStatusBadge({ status, size = "sm" }: BookingStatusBadgeProps) {
  switch (status) {
    case "draft":
      return (
        <Badge variant="gray" size={size} className="text-stone-600">
          ● Draft
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="blue" size={size} className="font-bold">
          ✓ Confirmed
        </Badge>
      );
    case "assigned":
      return (
        <Badge variant="saffron" size={size} className="font-bold">
          🚗 Assigned
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="green" size={size} className="font-extrabold animate-pulse">
          ⚡ In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="green" size={size} className="font-bold">
          ✓ Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="red" size={size} className="font-semibold">
          Cancelled
        </Badge>
      );
    case "no_show":
      return (
        <Badge variant="red" size={size} className="font-semibold">
          No Show
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
