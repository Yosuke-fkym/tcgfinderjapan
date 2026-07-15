"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface CardSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Large, responsive search field used at the top of the card encyclopedia. */
export function CardSearch({
  value,
  onChange,
}: CardSearchProps) {
    const { locale } = useParams();
  const t = getT(locale as string);
  return (
    <div className="relative w-full sm:max-w-xl">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.cardPage.searchTradingCards}
        aria-label="Search trading cards by name"
        className="h-14 w-full rounded-xl border-stone-300 bg-white pl-12 pr-4 text-base text-stone-900 shadow-sm transition-shadow placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#B23A2F]/40 focus-visible:ring-offset-0"
      />
    </div>
  );
}