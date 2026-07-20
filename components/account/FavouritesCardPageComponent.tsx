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

  
  if (isLoggedIn === null) {
    return (
      <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  if (favorites === null) {
    return (
      <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">{t.cardPage.favoriteCards.emptyTitle}</p>
        <p className="text-sm mt-1">
        {t.cardPage.favoriteCards.emptyDescription}
        </p>
        <Button asChild className="mt-6">
          <Link href={`/${locale}/cards`}>{t.cardPage.favoriteCards.browseCards}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{t.cardPage.favoriteCards.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
         {t.cardPage.favoriteCards.subtitle}
        </p>
      </div>

      {/* Reuse existing Card Encyclopedia grid */}
      <CardGrid cards={favorites} showFavoriteButton onRemoved={(slug) => {
    setFavorites((prev) =>
      prev ? prev.filter((card) => card.slug !== slug) : []
    );
  }} />
    </div>
  );
}