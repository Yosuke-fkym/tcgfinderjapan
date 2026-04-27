"use client";

import { CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export function EmptyState({ filter }: any) {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <CheckCircle2 className="text-green-500 mb-3" size={32} />

      <h2 className="text-lg font-semibold">
        {t.adminReports.report.emptyState.title}
      </h2>

      <p className="text-sm text-muted-foreground mt-1">
        {filter === "pending"
          ? t.adminReports.report.emptyState.allResolved
          : filter === "resolved"
          ? t.adminReports.report.emptyState.noneResolved
          : t.adminReports.report.emptyState.noIssues}
      </p>
    </div>
  );
}