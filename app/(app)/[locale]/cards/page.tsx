"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";

import { PackSearch } from "@/components/packs/PackSearch";
import { PackGrid } from "@/components/packs/PackGrid";
import { PackPagination } from "@/components/packs/PackPagination";
import { CardGrid } from "@/components/cards/CardGrid";
import type { Pack } from "@/types/pack";
import type { Card } from "@/types/card";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

const PAGE_SIZE = 8;
const SEARCH_PAGE_SIZE = 50; // wider limit while searching, no pagination shown
const SEARCH_DEBOUNCE_MS = 300;

export default function PackEncyclopediaPage() {
  const { locale } = useParams();
  const t = getT(locale as string);

  // --- Single search input, drives both pack + card search ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- Pack Encyclopedia (default, empty-search state) ---
  const [page, setPage] = useState(1);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPacks, setTotalPacks] = useState(0);

  // --- Combined search results (packs + cards) ---
  const [searchPacks, setSearchPacks] = useState<Pack[]>([]);
  const [searchCards, setSearchCards] = useState<Card[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const isSearching = debouncedSearch.trim().length > 0;

  function updateSearch(value: string) {
    setSearch(value);
  }

  function clearSearch() {
    setSearch("");
    setDebouncedSearch("");
  }

  async function fetchPacks() {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });

    const res = await fetch(`/api/packs?${params}`);
    const result = await res.json();

    setPacks(result.packs ?? []);
    setTotalPages(result.totalPages ?? 1);
    setTotalPacks(result.count ?? 0);

    setLoading(false);
  }

  // Existing paginated pack fetch — only runs when not searching
  useEffect(() => {
    if (!isSearching) {
      fetchPacks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isSearching]);

  // Debounce the shared search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch matching packs + cards together whenever the debounced query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchPacks([]);
      setSearchCards([]);
      return;
    }

    let cancelled = false;

    async function fetchResults() {
      setSearchLoading(true);

      const packParams = new URLSearchParams({
        search: debouncedSearch.trim(),
        page: "1",
        pageSize: String(SEARCH_PAGE_SIZE),
      });

      const cardParams = new URLSearchParams({
        search: debouncedSearch.trim(),
        page: "1",
        pageSize: String(SEARCH_PAGE_SIZE),
      });

      try {
        const [packRes, cardRes] = await Promise.all([
          fetch(`/api/packs?${packParams}`),
          fetch(`/api/cards?${cardParams}`),
        ]);

        const [packResult, cardResult] = await Promise.all([
          packRes.json(),
          cardRes.json(),
        ]);

        if (!cancelled) {
          setSearchPacks(packResult.packs ?? []);
          setSearchCards(cardResult.cards ?? []);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-stone-500">
            <li>
              <Link href={`/${locale}/`} className="transition-colors hover:text-stone-800">
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

        {/* Single shared search — reused PackSearch UI, now drives both packs + cards */}
        <div className="mb-8">
          <PackSearch value={search} onChange={updateSearch} />
        </div>

       {isSearching ? (
  searchLoading ? (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 px-6 py-20 text-stone-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{t.packPage.searching}</span>
    </div>
  ) : searchPacks.length === 0 && searchCards.length === 0 ? (
    /* Neither packs nor cards matched — single centered empty state */
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 px-6 py-20 text-center">
      <p className="text-lg font-semibold text-stone-800">
        {locale === "jp"
          ? "検索結果が見つかりませんでした。"
          : "No matching results found."}
      </p>
      <p className="text-sm text-stone-500">
        {locale === "jp"
          ? "別のキーワードで検索してください。"
          : "Try searching with a different keyword."}
      </p>
    </div>
  ) : (
    <div className="space-y-12">
      {/* Matching Packs — only rendered if there are pack results */}
      {searchPacks.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-stone-800">
           {t.packPage.matchingPacks}
          </h2>
          <PackGrid packs={searchPacks} onClearFilters={clearSearch} />
        </section>
      )}

      {/* Matching Cards — only rendered if there are card results */}
      {searchCards.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-stone-800">
            {t.packPage.matchingCards}
          </h2>
          <CardGrid cards={searchCards} onClearFilters={clearSearch} />
        </section>
      )}
    </div>
  )
) : (
  <>
    {/* Existing Pack Encyclopedia — unchanged */}
    <p className="mb-4 text-sm text-stone-400" aria-live="polite">
      {t.packPage.packCountFound
        .replace("{count}", totalPacks.toString())
        .replace("{plural}", totalPacks === 1 ? "" : "s")}
    </p>

    <PackGrid packs={packs} />

    <div className="mt-10">
      <PackPagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  </>
)}
      </div>
    </main>
  );
}