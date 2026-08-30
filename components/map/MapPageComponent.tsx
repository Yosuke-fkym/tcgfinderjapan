"use client";

import React, { useEffect, useState } from "react";
import Map from "@/components/map/Map";
import MapSearchBar from "@/components/map/MapSearchbar";
import { useMapFilters } from "@/hooks/mapFilter";
import { filterShops } from "@/lib/helpers/filterShops";
import { Shop } from "@/types/types";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { toast } from "sonner";
import ShopList from "../shopDetails/ShopList";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import ShopCard from "./ShopCard";

function MapPageComponent() {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  const { areas, productFlags, languages } = useFilterOptions(
    shops,
    locale as string,
  );
  const { filters } = useMapFilters();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();
        setIsLoggedIn(res.ok && !!data.user?.id);
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      }
    };

    check();
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return;
    if (!isLoggedIn) {
      setFavorites([]);
      return;
    }

    const fetchFavs = async () => {
      try {
        const res = await fetch("/api/favourites", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        const ids = data.data.map((f: any) => f.shop_id) as string[];

        setFavorites([...new Set(ids)]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavs();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("/api/shops");
        const data = await res.json();
        setShops(data.data || []);
      } catch (err) {
        console.error("Error fetching shops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const toggleFavorite = async (shop_id: string) => {
    if (!isLoggedIn) {
      toast.error(t.shopDetails.page.loginRequired);
      return;
    }

    const isFav = favorites.includes(shop_id);

    try {
      if (isFav) {
        await fetch("/api/favourites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shop_id }),
        });

        setFavorites((prev) => prev.filter((id) => id !== shop_id));
      } else {
        setFavorites((prev) =>
          prev.includes(shop_id) ? prev : [...prev, shop_id],
        );

        await fetch("/api/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shop_id }),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredShops = filterShops(shops, filters, favorites);

  const recentlyAddedShops = [...shops]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 4);

  const featuredShops = shops.filter((shop) => shop.is_featured).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <MapSearchBar
        areas={areas as string[]}
        productFlags={productFlags}
        languages={languages}
        isLoggedIn={!!isLoggedIn}
      />
      {loading ? (
        <MapPageLoading t={t} />
      ) : (
        <div className="flex shrink-0 relative z-1 sm:flex-row flex-col-reverse gap-4 sm:gap-0 overflow-hidden h-[calc(100vh-240px)] min-h-125">
          <div className="sm:w-[320px] w-full sm:border-r-[0.5px] border-r-[#ffffff42] overflow-y-auto shadow-sm custom-scrollbar">
            <ShopList
              onSelect={setSelectedShop}
              selected={selectedShop}
              shops={filteredShops}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </div>

          <div className="sm:flex-1 p-3 h-75 sm:h-full">
            <div className="w-full h-75 sm:h-full rounded-xl overflow-hidden shadow-sm border">
              <Map
                shops={filteredShops}
                selected={selectedShop}
                onSelect={setSelectedShop}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                isLoggedIn={!!isLoggedIn}
              />
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 space-y-14">
        {loading ? (
          <>
            <ShopSectionSkeleton />
            <ShopSectionSkeleton />
          </>
        ) : (
          <>
            {recentlyAddedShops.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    {t.map.shopCard.recentlyAddedShops}
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-5">
                  {recentlyAddedShops.map((shop) => (
                    <div
                      key={shop.shop_id}
                      className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]"
                    >
                      <ShopCard shop={shop} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {featuredShops.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    {t.map.shopCard.featuredShops}
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-5">
                  {featuredShops.map((shop) => (
                    <div
                      key={shop.shop_id}
                      className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]"
                    >
                      <ShopCard shop={shop} featured />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// supporting components
function MapPageLoading({ t }: { t: ReturnType<typeof getT> }) {
  return (
    <div className="flex shrink-0 relative z-1 sm:flex-row flex-col-reverse gap-4 sm:gap-0 h-[calc(100vh-240px)] min-h-125">
      {/* Shop list skeleton */}
      <div className="sm:w-[320px] w-full border-r-[0.5px] border-white/10 overflow-hidden">
        <div className="h-full p-4 space-y-5 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-white/5 pb-4"
            >
              <div className="h-11 w-11 shrink-0 rounded-full bg-white/10" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-white/10" />
                <div className="h-2.5 w-1/2 rounded bg-white/10" />
              </div>

              <div className="h-5 w-5 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Map skeleton */}
      <div className="sm:flex-1 p-3 h-75 sm:h-full">
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-white/3 animate-pulse">
          {/* Fake map roads/details */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute left-[15%] top-0 h-full w-px bg-white/10 rotate-12" />
            <div className="absolute left-[45%] top-0 h-full w-px bg-white/10 -rotate-[8deg]" />
            <div className="absolute left-[75%] top-0 h-full w-px bg-white/10 rotate-18" />

            <div className="absolute top-[30%] left-0 h-px w-full bg-white/10 rotate-3" />
            <div className="absolute top-[60%] left-0 h-px w-full bg-white/10 -rotate-[5deg]" />
            <div className="absolute top-[80%] left-0 h-px w-full bg-white/10 rotate-2" />
          </div>

          {/* Center loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/50 backdrop-blur-sm">
              {t.common.loading}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopSectionSkeleton() {
  return (
    <section>
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-white/10" />

      <div className="flex flex-wrap justify-center gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] overflow-hidden rounded-2xl border border-white/10 bg-white/3 animate-pulse"
          >
            <div className="aspect-4/3 bg-white/10" />

            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />

              <div className="flex gap-2">
                <div className="h-6 w-14 rounded-md bg-white/10" />
                <div className="h-6 w-16 rounded-md bg-white/10" />
              </div>

              <div className="border-t border-white/5 pt-3">
                <div className="h-3 w-24 rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MapPageComponent;
