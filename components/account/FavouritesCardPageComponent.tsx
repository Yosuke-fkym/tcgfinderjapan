"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { checkUser } from "@/lib/helpers/getUser";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { CardGrid } from "@/components/cards/CardGrid";
import { getT } from "@/lib/getT";
import { Card } from "@/types/card";
import { CreditCard } from "lucide-react";

export default function FavouriteCardsPageComponent() {
  const [favorites, setFavorites] = useState<Card[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { locale } = useParams();
  const t = getT(locale as string);

  useEffect(() => {
    checkUser({ setIsLoggedIn });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/cards/favorites", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data?.data) return;
        setFavorites(data.data);
      });
  }, [isLoggedIn]);

  
  if (isLoggedIn === null || favorites === null) {
    return (
      <div className="text-sm text-white/40 min-h-[50vh] flex justify-center items-center gap-2">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <CreditCard size={20} className="text-white/25" />
        </div>
        <p className="text-lg font-medium text-white">
          {t.cardPage.favoriteCards.emptyTitle}
        </p>
        <p className="text-sm text-white/45">
          {t.cardPage.favoriteCards.emptyDescription}
        </p>
        <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-full px-5">
          <Link href={`/${locale}/cards`}>
            {t.cardPage.favoriteCards.browseCards}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/20 to-indigo-600/[0.02] border border-indigo-500/25 flex items-center justify-center shrink-0">
          <CreditCard size={17} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {t.cardPage.favoriteCards.title}
          </h1>
          <p className="text-sm text-white/45">
            {t.cardPage.favoriteCards.subtitle}
          </p>
        </div>
      </div>

      {/* Reuse existing Card Encyclopedia grid — untouched */}
      <CardGrid
        cards={favorites}
        showFavoriteButton
        onRemoved={(slug) => {
          setFavorites((prev) =>
            prev ? prev.filter((card) => card.slug !== slug) : []
          );
        }}
      />
    </div>
  );
}