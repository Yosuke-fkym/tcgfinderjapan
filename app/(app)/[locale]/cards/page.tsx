"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { PackSearch } from "@/components/packs/PackSearch";
import { PackGrid } from "@/components/packs/PackGrid";
import { PackPagination } from "@/components/packs/PackPagination";
import type { Pack } from "@/types/pack";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

const PAGE_SIZE = 8;

export default function PackEncyclopediaPage() {
  const { locale } = useParams();
  const t = getT(locale as string);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPacks, setTotalPacks] = useState(0);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setPage(1);
  }

  async function fetchPacks() {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      search,
    });

    const res = await fetch(`/api/packs?${params}`);
    const result = await res.json();

    setPacks(result.packs ?? []);
    setTotalPages(result.totalPages ?? 1);
    setTotalPacks(result.count ?? 0);

    setLoading(false);
  }

  useEffect(() => {
    fetchPacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-stone-500">
            <li>
              <Link href="/" className="transition-colors hover:text-stone-800">
                {t.cardPage.home}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-stone-800" aria-current="page">
              {t.packPage.packEncyclopedia}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {t.packPage.packEncyclopedia}
          </h1>
          <p className="mt-2 text-stone-500">{t.packPage.searchExpansionPacks}</p>
        </header>

        {/* Search */}
        <div className="mb-8">
          <PackSearch value={search} onChange={updateSearch} />
        </div>

        {/* Results count */}
       <p className="mb-4 text-sm text-stone-400" aria-live="polite">
  {t.packPage.packCountFound
    .replace("{count}", totalPacks.toString())
    .replace("{plural}", totalPacks === 1 ? "" : "s")}
</p>

        {/* Grid */}
        <PackGrid packs={packs} onClearFilters={clearFilters} />

        {/* Pagination */}
        <div className="mt-10">
          <PackPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>
    </main>
  );
}