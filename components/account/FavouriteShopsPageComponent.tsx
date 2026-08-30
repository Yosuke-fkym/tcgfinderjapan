"use client"; 

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { checkUser } from "@/lib/helpers/getUser";
import Image from "next/image";
import { Spinner } from "../ui/spinner";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";

export default function FavouriteShopsPageComponent() {
  const [favorites, setFavorites] = useState<any[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

 useEffect(() => {
    checkUser({setIsLoggedIn})
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/favourites?all=true", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data?.data) return;
        setFavorites(data.data);
      });
  }, [isLoggedIn]);

  const removeFavorite = async (shop_id: string) => {
    if (!isLoggedIn) return;

    toast.success(t.favorites.removing);
    await fetch("/api/favourites", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop_id }),
    });

    setFavorites((prev) =>
      prev ? prev.filter((f) => f.shops.shop_id !== shop_id) : [],
    );
  };

  if (isLoggedIn === null) {
    return (
      <div className="text-sm text-white/40 min-h-[50vh] flex justify-center items-center gap-2">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  if (favorites === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <div className="h-40 bg-white/[0.04]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-white/[0.06] rounded w-3/4" />
              <div className="h-3 bg-white/[0.04] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <Heart size={20} className="text-white/25" />
        </div>
        <p className="text-lg font-medium text-white">{t.favorites.emptyTitle}</p>
        <p className="text-sm text-white/45">{t.favorites.emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/20 to-indigo-600/[0.02] border border-indigo-500/25 flex items-center justify-center shrink-0">
          <Heart size={17} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {t.favorites.title}
          </h1>
          <p className="text-sm text-white/45">{t.favorites.subtitle}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav) => (
          <div
            key={fav.shops?.shop_id}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-indigo-500/25 hover:bg-white/[0.035] transition-colors duration-300"
            onClick={() => router.push(`/${locale}/shop/${fav.shops?.shop_id}`)}
          >
            <div className="relative overflow-hidden">
              <Image
                height={160}
                width={256}
                alt={fav.shops?.shop_name}
                src={
                  fav.shops?.shop_photos?.[0]?.image_url || "/placeholder.jpg"
                }
                className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 group-hover:from-black/60 transition-colors duration-300" />

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.shops?.shop_id);
                }}
                className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-black/70 p-2 rounded-full transition-colors"
              >
                <Heart className="text-red-500 fill-red-500" size={15} />
              </button>
            </div>

            <div className="p-4">
              <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                {fav.shops?.shop_name_in_langs &&
                  fav.shops.shop_name_in_langs[
                    locale as keyof typeof translations
                  ]}
              </p>

              <p className="flex items-center gap-1.5 text-sm text-white/45 mt-1.5 line-clamp-1">
                <MapPin size={12} className="text-white/30 shrink-0" />
                {(fav.shops?.shop_address_in_langs &&
                  fav.shops.shop_address_in_langs[
                    locale as keyof typeof translations
                  ]) ||
                  t.favorites.unknownLocation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}