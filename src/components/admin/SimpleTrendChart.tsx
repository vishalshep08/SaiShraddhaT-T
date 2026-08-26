"use client";

import React, { useState } from "react";
import { TrendDataPoint } from "@/types/analytics";

interface SimpleTrendChartProps {
  data: TrendDataPoint[];
}

export function SimpleTrendChart({ data }: SimpleTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-stone-400">
        No trend data available for this date range.
      </div>
    );
  }

  // Find max value to scale the bars (minimum max is 5 to avoid flat charts)
  const maxVal = Math.max(
    5,
    ...data.map((d) => Math.max(d.enquiries, d.bookings, d.completedTrips))
  );

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-stone-600 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-stone-700 inline-block" />
            <span>Enquiries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand-maroon inline-block" />
            <span>Confirmed Bookings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
            <span>Completed Trips</span>
          </div>
        </div>

        <span className="text-[11px] text-stone-400">
          Showing {data.length} days activity
        </span>
      </div>

      {/* Bar Chart Container */}
      <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-200/80 overflow-x-auto">
        <div className="min-w-[600px] h-48 flex items-end justify-between gap-2 pt-6">
          {data.map((point, idx) => {
            const enqHeight = (point.enquiries / maxVal) * 100;
            const bookHeight = (point.bookings / maxVal) * 100;
            const tripHeight = (point.completedTrips / maxVal) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={point.date}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 bg-brand-charcoal-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap space-y-0.5 pointer-events-none">
                    <p className="font-bold text-brand-saffron-300 border-b border-brand-charcoal-700 pb-0.5">
                      {point.displayLabel}
                    </p>
                    <p>Enquiries: <strong>{point.enquiries}</strong></p>
                    <p>Bookings: <strong>{point.bookings}</strong></p>
                    <p>Completed: <strong>{point.completedTrips}</strong></p>
                  </div>
                )}

                {/* Bars Group */}
                <div className="w-full flex items-end justify-center gap-0.5 h-36">
                  {/* Enquiry Bar */}
                  <div
                    style={{ height: `${Math.max(point.enquiries > 0 ? 8 : 0, enqHeight)}%` }}
                    className={`w-2 sm:w-2.5 rounded-t transition-all ${
                      point.enquiries > 0 ? "bg-stone-700 group-hover:bg-stone-900" : "bg-transparent"
                    }`}
                  />
                  {/* Booking Bar */}
                  <div
                    style={{ height: `${Math.max(point.bookings > 0 ? 8 : 0, bookHeight)}%` }}
                    className={`w-2 sm:w-2.5 rounded-t transition-all ${
                      point.bookings > 0 ? "bg-brand-maroon group-hover:bg-brand-maroon-800" : "bg-transparent"
                    }`}
                  />
                  {/* Completed Bar */}
                  <div
                    style={{ height: `${Math.max(point.completedTrips > 0 ? 8 : 0, tripHeight)}%` }}
                    className={`w-2 sm:w-2.5 rounded-t transition-all ${
                      point.completedTrips > 0 ? "bg-emerald-600 group-hover:bg-emerald-700" : "bg-transparent"
                    }`}
                  />
                </div>

                {/* Date label at bottom */}
                <div className="pt-2 text-[10px] text-stone-400 font-medium truncate max-w-full text-center">
                  {idx % Math.ceil(data.length / 10) === 0 ? point.displayLabel : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
