"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getT } from "@/lib/getT";
import { RARITY_OPTIONS, SORT_OPTIONS, type CardFilterState, type Rarity, type SortOption } from "@/types/card";
import { useParams } from "next/navigation";

interface CardFiltersProps {
  filters: CardFilterState;
  onFilterChange: (partial: Partial<CardFilterState>) => void;
}

/**
 * Four independent filters (Game, Rarity, Expansion Pack, Sort).
 * These only ever touch local dummy state — nothing here talks to a server.
 */
export function CardFilters({ filters, onFilterChange }: CardFiltersProps) {
    const { locale } = useParams();
  const t = getT(locale as string);
  return (
    <div className="flex flex-wrap gap-3">

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-rarity" className="sr-only">
         {t.cardPage.cardFilter.filterByRarity}
        </label>
        <Select
          value={filters.rarity}
          onValueChange={(value) => onFilterChange({ rarity: value as Rarity | "all" })}
        >
          <SelectTrigger
            id="filter-rarity"
            className="h-11 w-38 rounded-lg border-stone-300 bg-white text-sm"
          >
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.cardPage.cardFilter.allRarities}</SelectItem>
            {RARITY_OPTIONS.map((rarity) => (
              <SelectItem key={rarity} value={rarity}>
                {rarity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 sm:ml-auto">
        <label htmlFor="filter-sort" className="sr-only">
          {t.cardPage.cardFilter.sortCards}
        </label>
        <Select
          value={filters.sort}
          onValueChange={(value) => onFilterChange({ sort: value as SortOption })}
        >
          <SelectTrigger
            id="filter-sort"
            className="h-11 w-38 rounded-lg border-stone-300 bg-white text-sm"
          >
            <SelectValue placeholder={t.cardPage.cardFilter.sort} />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}