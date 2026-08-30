"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Clock, MapPin, History } from "lucide-react";
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
      <div className="text-sm text-white/40 min-h-[50vh] flex justify-center items-center gap-2">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  if (history === null) {
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

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <Clock size={20} className="text-white/25" />
        </div>
        <p className="text-lg font-medium text-white">{t.history.emptyTitle}</p>
        <p className="text-sm text-white/45">{t.history.emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/20 to-indigo-600/[0.02] border border-indigo-500/25 flex items-center justify-center shrink-0">
          <History size={17} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {t.history.title}
          </h1>
          <p className="text-sm text-white/45">{t.history.subtitle}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-indigo-500/25 hover:bg-white/[0.035] transition-colors duration-300"
            onClick={() => router.push(`/${locale}/shop/${item.shop_id}`)}
          >
            <div className="relative overflow-hidden">
              <Image
                height={160}
                width={256}
                alt={item.shops?.shop_name}
                src={
                  item.shops?.shop_photos?.[0]?.image_url || "/placeholder.jpg"
                }
                className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 group-hover:from-black/60 transition-colors duration-300" />
            </div>

            <div className="p-4">
              <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                {item.shops?.shop_name_in_langs &&
                  item.shops.shop_name_in_langs[
                    locale as keyof typeof translations
                  ]}
              </p>

              <p className="flex items-center gap-1.5 text-sm text-white/45 mt-1.5 line-clamp-1">
                <MapPin size={12} className="text-white/30 shrink-0" />
                {(item.shops?.shop_address_in_langs &&
                  item.shops.shop_address_in_langs[
                    locale as keyof typeof translations
                  ]) ||
                  t.common.unknownLocation}
              </p>

              <p className="flex items-center gap-1.5 text-xs text-white/30 mt-3 pt-3 border-t border-white/[0.06]">
                <Clock size={11} />
                {t.history.viewedAt} {new Date(item.viewed_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}