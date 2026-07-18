"use client";

import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface PackSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/** Mirrors CardSearch's pill-shaped search input styling. */
export function PackSearch({ value, onChange }: PackSearchProps) {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.packPage.searchPlaceholder}
        className="w-full rounded-full border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-800 shadow-sm outline-none transition-colors placeholder:text-stone-400 focus:border-[#B23A2F]/40 focus:ring-2 focus:ring-[#B23A2F]/20"
      />
    </div>
  );
}