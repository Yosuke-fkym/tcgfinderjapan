"use client"; 

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
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
      <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5"/>
      </div>
    );
  }

  if (favorites === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden">
            <div className="h-40 bg-gray-200" />
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">{t.favorites.emptyTitle}</p>
        <p className="text-sm mt-1">
          {t.favorites.emptyDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{t.favorites.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.favorites.subtitle}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav) => (
          <Card
            key={fav.shops?.shop_id}
            className="group cursor-pointer pt-0 overflow-hidden border shadow-sm hover:shadow-md transition"
            onClick={() => router.push(`/${locale}/shop/${fav.shops?.shop_id}`)}
          >
            <div className="relative">
              {/* Image */}
              <Image
              height={160}
              width={256}
              alt={fav.shops?.shop_name}
                src={
                  fav.shops?.shop_photos?.[0]?.image_url || "/placeholder.jpg"
                }
                className="h-40 w-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

              {/* ❤️ Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.shops?.shop_id);
                }}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow"
              >
                <Heart className="text-red-500 fill-red-500" size={16} />
              </button>
            </div>

            <CardContent className="p-2 pt-0">
              <p className="font-semibold text-indigo-600 line-clamp-1">
                {
                  // locale === "jp" ?
                  // fav.shops?.shop_name
                  // :
                 fav.shops?.shop_name_in_langs && fav.shops.shop_name_in_langs[locale as keyof typeof translations]
                }
              </p>

              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {
                  // locale === "jp" ?
                  // fav.shops?.shop_address
                  // :
                  fav.shops?.shop_address_in_langs && fav.shops.shop_address_in_langs[locale as keyof typeof translations]
                 || t.favorites.unknownLocation
                }
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
