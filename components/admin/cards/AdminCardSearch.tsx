"use client";

import { Search, X } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function AdminCardSearch({ search, setSearch }: Props) {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
      />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.admin.cardsPage.searchPlaceholder || "Search cards..."}
        className="
          h-9 w-56 rounded-lg border border-white/20 bg-white/5
          pl-8 pr-8 text-sm text-white placeholder:text-white/40
          focus:outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/40
          transition-all duration-150
        "
      />
      {search !== "" && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}