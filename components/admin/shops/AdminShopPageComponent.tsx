"use client";

import { useEffect, useState } from "react";
import ShopsTable from "@/components/admin/shops/ShopsTable";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from "lucide-react";
import { AREA_OPTIONS } from "@/lib/helpers/areas";
import { Shop } from "@/types/types";
import AdminShopFilter from "./AdminShopFilter";

export default function AdminShopsPageComponent() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState("ALL");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<"loading" | "ready" | "error" | "empty">("loading");

  const { locale } = useParams();
  const t = getT(locale as string);

  useEffect(() => {
    fetchShops();
  }, [page, area]);

  const areas = AREA_OPTIONS.map((a) => ({
    value: a.value,
    label: t.ranking.areas[a.key as keyof typeof t.ranking.areas],
    group: a.group,
  }));

  const fetchShops = async () => {
    try {
      setLoading("loading");
      const params = new URLSearchParams();
      if (area !== "ALL") {
        params.append("area", area);
      }
      const res = await fetch(`/api/admin/shops?${params.toString()}&page=${page}`);

      if (!res.ok) throw new Error("Failed to fetch shops");

      const result = await res.json();

      setShops(result.data || []);
      setTotalPages(result.totalPages || 1);
      setLoading(result.data?.length > 0 ? "ready" : "empty");
    } catch (error) {
      console.error(error);
      setLoading("error");
    }
  };

  function getPageNums(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  // ─── Full-page loading (only on very first mount before any data) ───────────
  if (loading === "loading" && shops.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="ml-4 text-white">
          {t.admin.shopsPage.loading} <Spinner className="inline mx-0.5" />
        </p>
      </div>
    );
  }

  // ─── Main layout — always rendered once we have attempted a fetch ────────────
  return (
    <div className="flex flex-col gap-6 mx-2">

      {/* Toolbar — title left, filter + button right */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {t.admin.shopsPage.title}
        </h1>

        <div className="flex items-center gap-2.5">
          {/* Filter */}
          <AdminShopFilter
            area={area}
            areas={areas}
            open={open}
            setArea={(value) => {
              setArea(value);
              setPage(1);
            }}
            setOpen={setOpen}
          />

          {/* Premium Add Shop button */}
          <a
            href={`/${locale}/admin/shops/create`}
            className="
              relative inline-flex items-center gap-2
              px-4 py-2 rounded-lg text-sm font-medium
              bg-gradient-to-b from-indigo-500 to-indigo-700
              text-white shadow-md shadow-indigo-900/40
              ring-1 ring-indigo-400/30
              hover:from-indigo-400 hover:to-indigo-600
              hover:shadow-lg hover:shadow-indigo-900/50
              active:scale-[0.97] active:shadow-sm
              transition-all duration-150
            "
          >
            <Plus size={15} strokeWidth={2.5} className="opacity-90" />
            {t.admin.shopsPage.addShop}
          </a>
        </div>
      </div>

      {/* Content area */}
      {loading === "loading" ? (
        // Inline spinner while re-fetching (filter change / page change)
        <div className="flex justify-center items-center min-h-64">
          <p className="text-white">
            {t.admin.shopsPage.loading} <Spinner className="inline mx-0.5" />
          </p>
        </div>
      ) : loading === "error" ? (
        <div className="flex flex-col items-center gap-4 min-h-64 justify-center">
          <p className="text-red-500">{t.admin.shopsPage.error}</p>
          <button
            onClick={fetchShops}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {t.admin.shopsPage.retry}
          </button>
        </div>
      ) : loading === "empty" ? (
        // Empty state — no data for the selected filter
        <div className="flex flex-col items-center gap-3 min-h-64 justify-center text-center">
          <p className="text-white/50 text-sm">{t.admin.shopsPage.empty}</p>
          {area !== "ALL" && (
            <button
              onClick={() => { setArea("ALL"); setPage(1); }}
              className="text-indigo-400 text-sm underline underline-offset-2 hover:text-indigo-300 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <>
          <ShopsTable shops={shops} refresh={fetchShops} />

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20
                         text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
            >
              <ChevronsLeft size={15} />
            </button>

            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20
                         text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNums(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-white/30 select-none">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={p === page}
                  className={`h-9 w-9 flex items-center justify-center rounded-md text-sm transition-all duration-100
                    ${p === page
                      ? "border border-white/40 bg-white/10 text-white font-medium cursor-default"
                      : "border border-transparent text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20
                         text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
            >
              <ChevronRight size={15} />
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20
                         text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
            >
              <ChevronsRight size={15} />
            </button>
          </div>

          <p className="text-center text-xs text-white/30 mt-2">
            Page <span className="text-white/60 font-medium">{page}</span> of {totalPages}
          </p>
        </>
      )}
    </div>
  );
}