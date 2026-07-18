"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { getT } from "@/lib/getT";
import {PackSearch} from "@/components/packs/PackSearch";
import PackTable from "./PackTable";


export interface Pack {
  id: string;
  slug: string;
  name_en: string;
  name_jp: string;
  image_url: string | null;
  release_date: string | null;
  created_at: string;
}

export default function AdminPacksPageComponent() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState<
    "loading" | "ready" | "error" | "empty"
  >("loading");

  const { locale } = useParams();
  const t = getT(locale as string);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPacks();
    }, search ? 350 : 0);

    return () => clearTimeout(timeout);
  }, [page, search]);

  async function fetchPacks() {
    try {
      setLoading("loading");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      params.append("page", String(page));

      const res = await fetch(`/api/admin/packs?${params}`);

      if (!res.ok) throw new Error();

      const result = await res.json();

      setPacks(result.data || []);
      setTotalPages(result.totalPages || 1);

      setLoading(result.data?.length ? "ready" : "empty");
    } catch {
      setLoading("error");
    }
  }

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

  if (loading === "loading" && packs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-white">
          {t.admin.packsPage.loading}
          <Spinner className="inline mx-1" />
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mx-2">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-white">
          {t.admin.packsPage.title}
        </h1>

        <div className="flex items-center gap-2.5">
          <PackSearch
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <a
            href={`/${locale}/admin/packs/create`}
            className="
              relative inline-flex items-center gap-2
              px-4 py-2 rounded-lg text-sm font-medium
              bg-linear-to-b from-indigo-500 to-indigo-700
              text-white shadow-md shadow-indigo-900/40
              ring-1 ring-indigo-400/30
              hover:from-indigo-400 hover:to-indigo-600
              hover:shadow-lg hover:shadow-indigo-900/50
              active:scale-[0.97]
              transition-all
            "
          >
            <Plus size={15} />
            {t.admin.packsPage.addPack}
          </a>
        </div>
      </div>

      {loading === "loading" ? (
        <div className="flex justify-center items-center min-h-64">
          <p className="text-white">
            {t.admin.packsPage.loading}
            <Spinner className="inline mx-1" />
          </p>
        </div>
      ) : loading === "error" ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-64">
          <p className="text-red-500">{t.admin.packsPage.error}</p>

          <button
            onClick={fetchPacks}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            {t.admin.packsPage.retry}
          </button>
        </div>
      ) : loading === "empty" ? (
        <div className="flex flex-col items-center justify-center gap-3 min-h-64">
          <p className="text-white/50">
            {t.admin.packsPage.empty}
          </p>

          {search !== "" && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="text-indigo-400 underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <PackTable packs={packs} refresh={fetchPacks} />

          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20 text-white/60 disabled:opacity-30"
            >
              <ChevronsLeft size={15} />
            </button>

            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20 text-white/60 disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNums(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={i}
                  className="w-9 text-center text-white/30"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={p === page}
                  className={`h-9 w-9 rounded-md text-sm ${
                    p === page
                      ? "bg-white/10 border border-white/40 text-white"
                      : "text-white/50"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20 text-white/60 disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20 text-white/60 disabled:opacity-30"
            >
              <ChevronsRight size={15} />
            </button>
          </div>

          <p className="text-center text-xs text-white/30 mt-2">
            Page{" "}
            <span className="text-white/60 font-medium">
              {page}
            </span>{" "}
            of {totalPages}
          </p>
        </>
      )}
    </div>
  );
}