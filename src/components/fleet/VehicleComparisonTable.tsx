import React from "react";
import { VEHICLE_CATEGORIES } from "@/data/fleetData";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function VehicleComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-brand-ivory-200/90 border-b border-stone-200 text-brand-charcoal-900 font-bold">
            <th className="p-4 sm:p-4.5">Vehicle Category</th>
            <th className="p-4 sm:p-4.5">Typical Capacity</th>
            <th className="p-4 sm:p-4.5">Luggage Suitability</th>
            <th className="p-4 sm:p-4.5">Best Suited For</th>
            <th className="p-4 sm:p-4.5">Fleet Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-700">
          {VEHICLE_CATEGORIES.map((v) => (
            <tr key={v.id} className="hover:bg-stone-50/70 transition-colors">
              <td className="p-4 font-bold text-brand-charcoal-900">
                <div>{v.name}</div>
                <div className="text-[11px] text-stone-500 font-normal">{v.acType}</div>
              </td>
              <td className="p-4 font-semibold text-brand-charcoal-900 whitespace-nowrap">
                {v.typicalCapacity}
              </td>
              <td className="p-4 text-xs text-stone-600 whitespace-nowrap">
                {v.luggageCapacity}
              </td>
              <td className="p-4 text-xs text-stone-600 max-w-xs">
                {v.bestFor}
              </td>
              <td className="p-4 whitespace-nowrap">
                {v.isOwned ? (
                  <Badge variant="green" size="sm" className="font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {v.ownedCountText || "Owned Fleet"}
                  </Badge>
                ) : (
                  <Badge variant="gray" size="sm">
                    Available On Request
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
