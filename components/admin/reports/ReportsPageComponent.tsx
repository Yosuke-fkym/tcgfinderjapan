"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Gavel,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRightFromSquareIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewReport } from "@/types/types";
import { toast } from "sonner";
import { EmptyState } from "@/components/reports/EmptyState";
import { SkeletonList } from "@/components/reports/Skeleton";
import { StatCard } from "@/components/reports/StatsCard";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

const PAGE_SIZE = 5;

export default function AdminReportsPageComponent() {
  const { locale } = useParams();
  const t = getT(locale as string);

  const [reports, setReports] = useState<ReviewReport[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [page, setPage] = useState(1);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/shops/review-reports");
      const data = await res.json();
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  const total = reports.length;
  const pending = reports.filter((r) => r.status !== "resolved").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;

  const filteredReports = reports.filter((r) => {
    if (filter === "pending") return r.status !== "resolved";
    if (filter === "resolved") return r.status === "resolved";
    return true;
  });

  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE);
  const paginatedReports = filteredReports.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleDelete = async (reviewId: string, reportId: string) => {
    try {
      setLoadingId(reportId);
      await fetch("/api/admin/shops/review-reports", {
        method: "DELETE",
        body: JSON.stringify({ reviewId, reportId }),
      });
      toast.success(t.adminReports.toast.deleteSuccess);
      fetchReports();
    } catch {
      toast.error(t.adminReports.toast.deleteError);
    } finally {
      setLoadingId(null);
    }
  };

  const handleResolve = async (reportId: string) => {
    try {
      setLoadingId(reportId);
      await fetch("/api/admin/shops/review-reports", {
        method: "POST",
        body: JSON.stringify({ reportId, status: "resolved" }),
      });
      toast.success(t.adminReports.toast.resolveSuccess);
      fetchReports();
    } catch {
      toast.error(t.adminReports.toast.resolveError);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-white min-h-[calc(100vh-95px)] rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">{t.adminReports.title}</h1>

        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: t.adminReports.filters.all },
            { key: "pending", label: t.adminReports.filters.pending },
            { key: "resolved", label: t.adminReports.filters.resolved },
          ].map((f) => (
            <Button
              className={filter === f.key ? "bg-indigo-600" : ""}
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter(f.key as any);
                setPage(1);
              }}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <StatCard label={t.adminReports.stats.total} value={total} />
        <StatCard label={t.adminReports.stats.pending} value={pending} warning />
        <StatCard label={t.adminReports.stats.resolved} value={resolved} success />
      </div>

      {/* Content */}
      <div className="grid gap-5">
        {loading ? (
          <SkeletonList />
        ) : paginatedReports.length > 0 ? (
          paginatedReports.map((r, index) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: index * 0.05 }}
              className="border bg-white/70 backdrop-blur rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.adminReports.report.reasonLabel}
                  </p>
                  <p className="font-medium">{r.reason}</p>
                </div>

                {r.status === "resolved" ? (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 size={14} className="mr-1" />
                    {t.adminReports.report.resolved}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle size={14} className="mr-1" />
                    {t.adminReports.report.pending}
                  </Badge>
                )}
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p>{r.review?.comment}</p>

                <div className="flex gap-1">
                  {Array.from({ length: r.review?.rating || 0 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-4">
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  disabled={loadingId === r.id}
                  onClick={() => handleDelete(r.review_id, r.id)}
                >
                  <Gavel size={16} className="mr-1" />
                  {t.adminReports.actions.delete}
                </Button>

                {r.status !== "resolved" ? (
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto"
                    disabled={loadingId === r.id}
                    onClick={() => handleResolve(r.id)}
                  >
                    {t.adminReports.actions.markResolved}
                  </Button>
                ) : (
                  <Button className="w-full sm:w-auto" disabled>
                    {t.adminReports.actions.resolved}
                  </Button>
                )}

                <div className="flex justify-start sm:ml-auto">
                  <a
                    href={`/${locale}/shop/${r.review?.shop_id}`}
                    target="_blank"
                    className="text-sm text-gray-600 hover:underline flex items-center"
                  >
                    {t.adminReports.actions.viewShop}
                    <ArrowUpRightFromSquareIcon
                      className="ml-1 inline-flex"
                      size={15}
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState filter={filter} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t.adminReports.pagination.previous}
          </Button>

          <span className="px-3 py-1 text-sm">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t.adminReports.pagination.next}
          </Button>
        </div>
      )}
    </div>
  );
}