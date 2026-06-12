"use client";

import { useEffect, useState } from "react";
import ShopsTable from "@/components/admin/shops/ShopsTable";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function AdminShopsPageComponent() {
  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<
    "loading" | "ready" | "error" | "empty"
  >("loading");

  const { locale } = useParams();
  const t = getT(locale as string);

  useEffect(() => {
  fetchShops();
}, [page]);

 const fetchShops = async () => {
  try {
    const res = await fetch(`/api/admin/shops?page=${page}`);

    if (!res.ok) throw new Error("Failed to fetch shops");

    const result = await res.json();

    setShops(result.data || []);
    setTotalPages(result.totalPages || 1);

    setLoading(
      result.data?.length > 0 ? "ready" : "empty"
    );
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
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

  if (loading === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="ml-4 text-white">
           {t.admin.shopsPage.loading} <Spinner className="inline mx-0.5"/>
        </p>
      </div>
    );
  }

  if (loading === "empty") {
    return (
      <div className="flex flex-col items-center text-white gap-4 min-h-125 h-125 justify-center">
        <p className="text-gray-500">
          {t.admin.shopsPage.empty}
        </p>
        <a
          href={`/${locale}/admin/shops/create`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t.admin.shopsPage.addShop}
        </a>
      </div>
    );
  }

  if (loading === "error") {
    return (
      <div className="flex flex-col items-center gap-4 min-h-125 h-125 justify-center">
        <p className="text-red-500">
          {t.admin.shopsPage.error}
        </p>
        <button
          onClick={fetchShops}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t.admin.shopsPage.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mx-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {t.admin.shopsPage.title}
        </h1>

        <a
          href={`/${locale}/admin/shops/create`}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {t.admin.shopsPage.addShop}
        </a>
      </div>

      <ShopsTable shops={shops} refresh={fetchShops} />

<div className="flex items-center justify-center gap-1.5 mt-6">
  
  {/* First */}
  <button
    disabled={page === 1}
    onClick={() => setPage(1)}
    className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20
               text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5
               disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
  >
    <ChevronsLeft size={15} />
  </button>

  {/* Prev */}
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20
               text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5
               disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
  >
    <ChevronLeft size={15} />
  </button>

  {/* Page numbers */}
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

  {/* Next */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
    className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20
               text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5
               disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
  >
    <ChevronRight size={15} />
  </button>

  {/* Last */}
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

{/* Page indicator */}
<p className="text-center text-xs text-white/30 mt-2">
  Page <span className="text-white/60 font-medium">{page}</span> of {totalPages}
</p>
    </div>
  );
}