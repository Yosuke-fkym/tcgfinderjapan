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
import { useEffect } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

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

  const activeCount =
    filters.area.length +
    filters.productFlags.length +
    filters.language.length +
    (filters.openNow ? 1 : 0);

  return (
    <div className="w-full mx-auto border-b-[0.5px] border-b-[#ffffff42] px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl lg:w-full w-full sm:w-[80%] mx-auto flex gap-2">

        {/* 🔍 Search */}
        <div className="relative flex-1 sm:w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.map.search.placeholder}
            value={filters.query}
            onChange={(e) =>
              updateFilters({ query: e.target.value })
            }
            className="pl-9 bg-white"
          />
        </div>

        {/* 🎯 Filters */}
        <Popover>
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
              {areas.map((a) => (
                <div key={a} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.area.includes(a)}
                    onCheckedChange={() =>
                      updateFilters({
                        area: toggleValue(filters.area, a),
                      })
                    }
                  />
                  <span className="text-sm">{a}</span>
                </div>
              ))}
            </div>

            {/* 🏷️ Product */}
            <div>
              <p className="text-sm font-medium mb-2">{t.map.filters.productTags}</p>
              {productFlags.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.productFlags.includes(p)}
                    onCheckedChange={() =>
                      updateFilters({
                        productFlags: toggleValue(
                          filters.productFlags,
                          p
                        ),
                      })
                    }
                  />
                  <span className="text-sm">{p}</span>
                </div>
              ))}
            </div>

            {/* 🌐 Language */}
            <div>
              <p className="text-sm font-medium mb-2">{t.map.filters.language}</p>
              {languages.map((l) => (
                <div key={l} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.language.includes(l)}
                    onCheckedChange={() =>
                      updateFilters({
                        language: toggleValue(
                          filters.language,
                          l
                        ),
                      })
                    }
                  />
                  <span className="text-sm">{l}</span>
                </div>
              ))}
            </div>

            {/* ⏰ Open Now */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={filters.openNow}
                onCheckedChange={() =>
                  updateFilters({
                    openNow: !filters.openNow,
                  })
                }
              />
              <span className="text-sm">{t.map.filters.openNow}</span>
            </div>

            {/* ❤️ Favorites Only */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={filters.favoritesOnly}
                disabled={!isLoggedIn}
                onCheckedChange={() =>
                  updateFilters({
                    favoritesOnly: !filters.favoritesOnly,
                  })
                }
              />
              <span className="text-sm">{t.map.filters.favoritesOnly}</span>
            </div>

            {/* 🧹 Clear Filters */}
            <Button
              variant="ghost"
              className="w-full bg-black text-white"
              onClick={() =>
                updateFilters({
                  query: "",
                  area: [],
                  productFlags: [],
                  language: [],
                  openNow: false,
                  favoritesOnly: false,
                })
              }
            >
              {t.map.filters.clear}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}