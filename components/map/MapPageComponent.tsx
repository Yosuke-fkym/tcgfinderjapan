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

function MapPageComponent() {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  const { areas, productFlags, languages } = useFilterOptions(shops, locale as string);
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
          prev.includes(shop_id) ? prev : [...prev, shop_id]
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
// console.log(areas);

  const filteredShops = filterShops(shops, filters, favorites);

  return (
    <div className="flex flex-col h-screen">
      <MapSearchBar
        areas={areas as string[]}
        productFlags={productFlags}
        languages={languages}
        isLoggedIn={!!isLoggedIn}
      />

      <div className="flex sm:flex-1 relative z-1 sm:flex-row flex-col-reverse gap-4 sm:gap-0 overflow-hidden">
        <div className="sm:w-[320px] w-full sm:border-r-[0.5px] border-r-[#ffffff42] overflow-y-auto shadow-sm">
          {loading ? (
            <div className="p-6 text-sm text-gray-500 text-center">
              {t.map.loading}
            </div>
          ) : (
            <ShopList
              onSelect={setSelectedShop}
              selected={selectedShop}
              shops={filteredShops}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>

        <div className="sm:flex-1 p-3 h-[300px] sm:h-full">
          <div className="w-full h-[300px] sm:h-full rounded-xl overflow-hidden shadow-sm border">
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
    </div>
  );
}

export default MapPageComponent;