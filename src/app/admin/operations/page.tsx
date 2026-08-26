import React from "react";
import { getDailyOperationsAction } from "@/actions/operationsActions";
import { DailyOperationsManager } from "@/components/admin/DailyOperationsManager";

export const dynamic = "force-dynamic";

interface AdminOperationsPageProps {
  searchParams: {
    date?: string;
  };
}

export default async function AdminOperationsPage({ searchParams }: AdminOperationsPageProps) {
  const operationsData = await getDailyOperationsAction(searchParams.date);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <DailyOperationsManager initialData={operationsData} />
    </div>
  );
}
