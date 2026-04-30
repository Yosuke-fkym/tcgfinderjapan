"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { checkUser } from "@/lib/helpers/getUser";
import Image from "next/image";
import { Spinner } from "../ui/spinner";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";

export default function ViewedHistoryPageComponent() {
  const [history, setHistory] = useState<any[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

  useEffect(() => {
    checkUser({ setIsLoggedIn });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/shops/viewed_history", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data?.data) return;
        setHistory(data.data);
      });
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return (
      <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5"/>
      </div>
    );
  }

  if (history === null) {
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

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <Clock size={40} className="mb-4 opacity-60" />
        <p className="text-lg font-medium">{t.history.emptyTitle}</p>
        <p className="text-sm mt-1">{t.history.emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {t.history.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t.history.subtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <Card
            key={item.id}
            className="group pt-0 cursor-pointer overflow-hidden border shadow-sm hover:shadow-md transition"
            onClick={() => router.push(`/${locale}/shop/${item.shop_id}`)}
          >
            <div className="relative">
              {/* Image */}
              <Image
                height={160}
                width={256}
                alt={item.shops?.shop_name}
                src={
                  item.shops?.shop_photos?.[0]?.image_url || "/placeholder.jpg"
                }
                className="h-40 w-full object-cover"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </div>

            <CardContent className="p-2 pt-0">
              <p className="font-semibold text-indigo-600 line-clamp-1">
                {
                  locale === "jp" ?
                  item.shops?.shop_name 
                  :
                  item.shops?.shop_name_in_langs && item.shops.shop_name_in_langs[locale as keyof typeof translations]
                }
              </p>

              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {
                  locale === "jp" ?
                  item.shops?.shop_address
                  :
                  item.shops?.shop_address_in_langs && item.shops.shop_address_in_langs[locale as keyof typeof translations]
                || t.common.unknownLocation
                } 
              </p>

              {/* Viewed time */}
              <p className="text-xs text-gray-400 mt-2">
                {t.history.viewedAt} {new Date(item.viewed_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}