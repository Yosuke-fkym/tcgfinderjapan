"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, Search } from "lucide-react";
import { useMapFilters } from "@/hooks/mapFilter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { AREA_OPTIONS } from "@/lib/helpers/areas";
import { LANGUAGE_LABELS } from "@/lib/helpers/language";

type Props = {
  areas: string[];
  productFlags: string[];
  languages: string[];
  isLoggedIn: boolean | null;
};

export default function MapSearchBar({
  areas,
  productFlags,
  languages,
  isLoggedIn,
}: Props) {
  const { filters, updateFilters } = useMapFilters();
  const { locale } = useParams();
  const t = getT(locale as string);
  const [tempFilters, setTempFilters] = useState(filters);
  const [open, setOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(filters.query);
  const [isComposing, setIsComposing] = useState(false);

  const availableAreas = new Set(areas);
  const filteredAreas = AREA_OPTIONS.filter((a) =>
  availableAreas.has(a.value)
);
  useEffect(() => {
    if (filters.favoritesOnly && isLoggedIn === false) {
      toast.error(t.shopDetails.page.loginRequired);
    }
  }, [filters.favoritesOnly, isLoggedIn]);

  const toggleValue = (arr: string[], value: string) => {
    return arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
  };

  function normalizeLanguage(value: string) {
  if (value === "日本語") return "japanese";
  if (value === "英語") return "english";
  return value;
}


  useEffect(() => {
  setTempFilters(filters);
}, [filters]);
useEffect(() => {
  setLocalQuery(filters.query);
}, []);

  const activeCount =
  tempFilters.area.length +
  tempFilters.productFlags.length +
  tempFilters.language.length +
  (tempFilters.openNow ? 1 : 0);


    // debouncing search input with IME support
  useEffect(() => {
  if (isComposing) return;

  const timeout = setTimeout(() => {
    if (localQuery !== filters.query) {
      updateFilters({ query: localQuery });
    }
  }, 400);

  return () => clearTimeout(timeout);
}, [localQuery, isComposing]);
// console.log(productFlags);


  return (
    <div className="w-full mx-auto border-b-[0.5px] border-b-[#ffffff42] px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl lg:w-full w-full sm:w-[80%] mx-auto flex gap-2">

        {/* 🔍 Search */}
        <div className="relative flex-1 sm:w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
  value={localQuery}
   onKeyDown={(e) => {
    if (e.key === "Enter") {
      updateFilters({ query: localQuery });
    }
  }}
  placeholder={t.map.search.placeholder}
  className="pl-9 bg-white"

  onChange={(e) => setLocalQuery(e.target.value)}

  // 🔥 IME fix
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={(e) => {
    setIsComposing(false);
    setLocalQuery(e.currentTarget.value);
  }}
/>
        </div>

        {/* 🎯 Filters */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 flex cursor-pointer border-none aria-expanded:bg-indigo-600 aria-expanded:text-white bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:text-white">
              <SlidersHorizontal size={16} />
              <span className="sm:flex hidden">
                {t.map.filters.title}
              </span>
              {activeCount > 0 && (
                <span className="ml-1 text-xs bg-black text-white px-1 sm:px-2 rounded-full">
                  {activeCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-72 space-y-4">

            {/* 📍 Area */}
            <div>
              <p className="text-sm font-medium mb-2">{t.map.filters.area}</p>
             {filteredAreas.map((a) => (
  <div key={a.value} className="flex items-center gap-2">
    <Checkbox
      checked={tempFilters.area.includes(a.value)}
      onCheckedChange={() =>
        setTempFilters((prev) => ({
          ...prev,
          area: toggleValue(prev.area, a.value),
        }))
      }
    />
    <span className="text-sm">
      {t.ranking?.areas?.[a.key as keyof typeof t.ranking.areas] ?? a.value}
    </span>
  </div>
))}
            </div>

            {/* 🏷️ Product */}
            <div>
              <p className="text-sm font-medium mb-2">{t.map.filters.productTags}</p>
              {productFlags.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <Checkbox
                    checked={tempFilters.productFlags.includes(p)}
                    onCheckedChange={() =>
  setTempFilters((prev) => ({
    ...prev,
    productFlags: toggleValue(prev.productFlags, p),
  }))
}
                  />
                  <span className="text-sm">{t.admin.shopForm.extras.productTags[p.toLowerCase().replace(" ", '') as keyof typeof t.admin.shopForm.extras.productTags]}</span>
                </div>
              ))}
            </div>

            {/* 🌐 Language */}
           {/* <div>
  <p className="text-sm font-medium mb-2">
    {t.map.filters.language}
  </p>

  {languages.map((l) => (
    <div key={l} className="flex items-center gap-2">
      <Checkbox
        checked={tempFilters.language.includes(l)}
        onCheckedChange={() =>
          setTempFilters((prev) => ({
            ...prev,
            language: toggleValue(prev.language, l),
          }))
        }
      />

      <span className="text-sm">
        {(locale === 'en' || locale === 'jp')
          ? LANGUAGE_LABELS[locale as keyof typeof LANGUAGE_LABELS]?.[normalizeLanguage(l) as keyof typeof LANGUAGE_LABELS.en] ?? l
          : l}
      </span>
    </div>
  ))}
</div> */}

            {/* ⏰ Open Now */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={tempFilters.openNow}
                onCheckedChange={() =>
  setTempFilters((prev) => ({
    ...prev,
    openNow: !prev.openNow,
  }))
}
              />
              <span className="text-sm">{t.map.filters.openNow}</span>
            </div>

            {/* ❤️ Favorites Only */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={tempFilters.favoritesOnly}
                disabled={!isLoggedIn}
              onCheckedChange={() =>
  setTempFilters((prev) => ({
    ...prev,
    favoritesOnly: !prev.favoritesOnly,
  }))
}
              />
              <span className="text-sm">{t.map.filters.favoritesOnly}</span>
            </div>

            {/* 🧹 Clear Filters */}
         <Button
  variant="ghost"
  className="w-full bg-black text-white mb-0"
  onClick={() => {
    const cleared = {
      query: "",
      area: [],
      productFlags: [],
      language: [],
      openNow: false,
      favoritesOnly: false,
    };

    setTempFilters(cleared);     
    updateFilters(cleared);      
  }}
>
  {t.map.filters.clear}
</Button>
            <Button
  className="w-full bg-indigo-600 text-white"
  onClick={() => {
    updateFilters(tempFilters);
    setOpen(false);
  }}
>
  {t.map.filters.apply}
</Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}