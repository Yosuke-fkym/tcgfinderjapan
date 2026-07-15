"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CardSearch } from "@/components/cards/CardSearch";
import { CardFilters } from "@/components/cards/CardFilters";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardPagination } from "@/components/cards/CardPagination";
import type { Card, CardFilterState } from "@/types/card";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

const PAGE_SIZE = 8;

const DEFAULT_FILTERS: CardFilterState = {
  search: "",
  rarity: "all",
  sort: "newest",
};

export default function CardEncyclopediaPage() {
    const { locale } = useParams();
    const t = getT(locale as string);
  const [filters, setFilters] = useState<CardFilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
const [loading, setLoading] = useState(true);
const [totalPages, setTotalPages] = useState(1);
const [totalCards, setTotalCards] = useState(0);

  function updateFilters(partial: Partial<CardFilterState>) {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }

  async function fetchCards() {
  setLoading(true);

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
    search: filters.search,
    rarity: filters.rarity,
    sort: filters.sort,
  });

  const res = await fetch(`/api/cards?${params}`);

  const result = await res.json();

  setCards(result.cards ?? []);
  setTotalPages(result.totalPages ?? 1);
  setTotalCards(result.count ?? 0);

  setLoading(false);
}

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  useEffect(() => {
  fetchCards();
}, [page, filters]);


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
              {t.cardPage.cardEncyclopedia}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {t.cardPage.cardEncyclopedia}
          </h1>
          <p className="mt-2 text-stone-500">
           {t.cardPage.searchTradingCards}
          </p>
        </header>

        {/* Search */}
        <div className="mb-6">
          <CardSearch
            value={filters.search}
            onChange={(value) => updateFilters({ search: value })}
          />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CardFilters filters={filters} onFilterChange={updateFilters} />
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-stone-400" aria-live="polite">
          {totalCards} card{totalCards === 1 ? "" : "s"} found
        </p>

        {/* Grid */}
        <CardGrid
    cards={cards}
    onClearFilters={clearFilters}
/>
        {/* Pagination */}
        <div className="mt-10">
          <CardPagination
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