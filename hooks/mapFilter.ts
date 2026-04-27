"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export type Filters = {
  query: string;
  area: string[];
  productFlags: string[];
  language: string[];
  openNow: boolean;
  favoritesOnly: boolean;
};

export function useMapFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useParams();

  const [filters, setFilters] = useState<Filters>({
    query: "",
    area: [],
    productFlags: [],
    language: [],
    openNow: false,
    favoritesOnly: false,
  });

  // ✅ Read from URL → state
  useEffect(() => {
    const query = searchParams.get("query") || "";
    const area = searchParams.get("area")?.split(",") || [];
    const product = searchParams.get("product")?.split(",") || [];
    const lang = searchParams.get("lang")?.split("・") || [];
    const open = searchParams.get("open") === "true";
    const fav = searchParams.get("fav") === "true"; // ✅ added

    setFilters({
      query,
      area,
      productFlags: product,
      language: lang,
      openNow: open,
      favoritesOnly: fav, // ✅ added
    });
  }, [searchParams]);

  // ✅ Update URL
  const updateFilters = (newFilters: Partial<Filters>) => {
    const updated = { ...filters, ...newFilters };

    const params = new URLSearchParams();

    if (updated.query) params.set("query", updated.query);
    if (updated.area.length)
      params.set("area", updated.area.join(","));
    if (updated.productFlags.length)
      params.set("product", updated.productFlags.join(","));
    if (updated.language.length)
      params.set("lang", updated.language.join("・"));
    if (updated.openNow) params.set("open", "true");
    if (updated.favoritesOnly) params.set("fav", "true"); // ✅ added

    router.replace(`/${locale}/map?${params.toString()}`);
  };

  return {
    filters,
    updateFilters,
  };
}