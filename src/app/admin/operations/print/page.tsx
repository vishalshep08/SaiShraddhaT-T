import React from "react";
import { getDailyOperationsAction } from "@/actions/operationsActions";

export const dynamic = "force-dynamic";

interface PrintSchedulePageProps {
  searchParams: {
    date?: string;
  };
}

export default async function PrintSchedulePage({ searchParams }: PrintSchedulePageProps) {
  const operationsData = await getDailyOperationsAction(searchParams.date);

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 12mm 12mm 12mm 12mm; size: A4 landscape; }
          body { font-size: 12px !important; color: #000 !important; background: #fff !important; }
          .no-print { display: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #333 !important; padding: 6px 8px !important; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; }
        }
        body { font-family: 'Segoe UI', system-ui, sans-serif; }
      `}</style>

      {/* Screen toolbar (hidden in print) */}
      <div className="no-print bg-stone-100 border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <a
          href={`/admin/operations?date=${operationsData.date}`}
          className="text-xs font-semibold text-brand-maroon hover:underline"
        >
          ← Back to Operations Workspace
        </a>
        <button
          onClick={() => window.print()}
          className="px-4 py-1.5 rounded-lg bg-brand-charcoal-900 text-white text-xs font-bold shadow-xs hover:bg-black"
        >
          Print Daily Schedule / Save PDF
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-5 text-black">
        {/* Business Header */}
        <div className="border-b-2 border-black pb-3 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight">
              Sai Shraddha Tours &amp; Travels, Shirdi
            </h1>
            <p className="text-xs text-stone-700 mt-0.5">
              Sai Ashram (Bhakta Niwas 1000 Rooms), Pimpalwadi Road, Shirdi — 423 109
            </p>
            <p className="text-xs text-stone-700">
              Desk / Owner: Ramesh Shep (+91 98900 73081)
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-base font-extrabold uppercase tracking-wide text-brand-maroon">
              Daily Dispatch Schedule
            </h2>
            <p className="text-sm font-bold mt-0.5">
              🗓 {operationsData.formattedDate}
            </p>
            <p className="text-[11px] text-stone-600">
              Total Trips: <strong>{operationsData.trips.length}</strong>
            </p>
          </div>
        </div>

        {/* Schedule Table */}
        {operationsData.trips.length === 0 ? (
          <div className="p-8 text-center border border-stone-300 rounded text-sm italic text-stone-600">
            No trips scheduled for {operationsData.formattedDate}.
          </div>
        ) : (
          <table className="w-full text-left text-xs border border-stone-400">
            <thead>
              <tr className="bg-stone-100 text-stone-900 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="p-2 border border-stone-400 w-16">Time</th>
                <th className="p-2 border border-stone-400 w-24">Ref #</th>
                <th className="p-2 border border-stone-400">Customer &amp; Contact</th>
                <th className="p-2 border border-stone-400">Route &amp; Pickup Point</th>
                <th className="p-2 border border-stone-400">Pax</th>
                <th className="p-2 border border-stone-400">Assigned Cab</th>
                <th className="p-2 border border-stone-400">Assigned Driver</th>
                <th className="p-2 border border-stone-400 w-20">Status</th>
                <th className="p-2 border border-stone-400">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300">
              {operationsData.trips.map((t, idx) => (
                <tr key={t.id} className="border-b border-stone-300">
                  <td className="p-2 border border-stone-400 font-bold whitespace-nowrap">
                    {t.pickupTime || "TBD"}
                  </td>
                  <td className="p-2 border border-stone-400 font-mono font-bold">
                    {t.bookingReference}
                  </td>
                  <td className="p-2 border border-stone-400">
                    <span className="font-bold block">{t.customerName}</span>
                    <span className="font-mono text-[11px]">{t.customerMobile}</span>
                  </td>
                  <td className="p-2 border border-stone-400">
                    <span className="font-semibold">{t.pickupLocation} → {t.destination}</span>
                    {t.pickupLandmark && (
                      <span className="block text-[10px] text-stone-600">Pt: {t.pickupLandmark}</span>
                    )}
                  </td>
                  <td className="p-2 border border-stone-400 text-center font-bold">
                    {t.passengerCount}
                  </td>
                  <td className="p-2 border border-stone-400 font-semibold">
                    {t.assignedVehicleName || <span className="text-red-700 italic">Not assigned</span>}
                  </td>
                  <td className="p-2 border border-stone-400">
                    <span className="font-semibold block">
                      {t.assignedDriverName || <span className="text-red-700 italic">Not assigned</span>}
                    </span>
                    {t.assignedDriverMobile && (
                      <span className="font-mono text-[10px] text-stone-600">{t.assignedDriverMobile}</span>
                    )}
                  </td>
                  <td className="p-2 border border-stone-400 capitalize font-medium text-[11px]">
                    {t.status.replace("_", " ")}
                  </td>
                  <td className="p-2 border border-stone-400 text-[10px] text-stone-700">
                    {t.pickupNotes || t.journeyNotes || t.internalAdminNotes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-stone-400 flex items-center justify-between text-[10px] text-stone-600">
          <span>Sai Shraddha Tours &amp; Travels • Shirdi Central Dispatch Sheet</span>
          <span>
            Generated:{" "}
            {new Intl.DateTimeFormat("en-IN", {
              timeZone: "Asia/Kolkata",
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date())}
          </span>
        </div>
      </div>
    </>
  );
}
