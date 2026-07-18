/**
 * Shared types and constants for the TCG Finder Japan Card Encyclopedia.
 */

export type Rarity =
  | "C"
  | "U"
  | "R"
  | "RR"
  | "AR"
  | "SR"
  | "SAR"
  | "UR"
  | "ACE SPEC"
  | "MUR"
  | "FUR"
  | "MA"
  | "BWR"
  | "SSR"
  | "SSS"
  | "Masterball"
  | "Monsterball"
  | "CSR"
  | "CHR"
  | "HR"
  | "RRR"
  | "K"
  | "A"
  | "PR"
  | "H"
  | "TR"
  | "PROMO";

export type SortOption =
  | "newest"
  | "name-asc"
  | "name-desc";

export type FilterValue<T extends string> = T | "all";

export interface CardFilterState {
  search: string;
  rarity: FilterValue<Rarity>;
  sort: SortOption;
}

export interface Card {
  id: string;
  card_name: string;
  pack_name: string;
  card_name_in_langs: Record<string, string>;
  pack_name_in_langs: Record<string, string>;
  card_number?: string;
  rarity?: Rarity;
  illustrator_name?: string;
  slug: string;
  pack_code?: string;
  card_image?: string | null;
  productFlags: string[];
  article_id?: string | number | null;
  affiliate_keywords?: string[];
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Filters                                  */
/* -------------------------------------------------------------------------- */

export const RARITY_OPTIONS = [
  "C",
  "U",
  "R",
  "RR",
  "AR",
  "SR",
  "SAR",
  "UR",
  "ACE SPEC",
  "MUR",
  "FUR",
  "MA",
  "BWR",
  "SSR",
  "SSS",
  "Masterball",
  "Monsterball",
  "CSR",
  "CHR",
  "HR",
  "RRR",
  "K",
  "A",
  "PR",
  "H",
  "TR",
  "PROMO",
] as const;

export const SORT_OPTIONS: ReadonlyArray<{
  value: SortOption;
  label: string;
}> = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "name-asc",
    label: "Name A–Z",
  },
  {
    value: "name-desc",
    label: "Name Z–A",
  },
];