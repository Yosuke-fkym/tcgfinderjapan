"use client"
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Card, Rarity } from "@/types/card";
import { RarityBadge } from "@/components/cards/RarityBadge";
import { FavoriteButton } from "./FavoriteButton";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface CardItemProps {
  card: Card;
  onRemoved?: (slug: string) => void;
  showFavoriteButton?: boolean;
}

/**
 * The entire card is a single focusable, clickable target (a Link), so
 * keyboard and screen-reader users get the same affordance as mouse users.
 * The visible "arrow button" is decorative — it lives inside the same Link,
 * not a separate nested interactive element.
 */
export function CardItem({ card, showFavoriteButton = false, onRemoved }: CardItemProps) {
    const { locale } = useParams();
  const t = getT(locale as string);
  return (
    <Link
      href={`/cards/${card.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B23A2F]/50"
      aria-label={`${card.card_name}, ${card.card_number}, ${card.rarity}`}
    >
      <div className="relative aspect-5/7 w-full overflow-hidden bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.card_image as string}
          alt={`${card.card_name} ${t.cardPage.cardItem.cardArt}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {showFavoriteButton && (
          <div className="absolute bottom-[10px] right-[10px]"
          onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}>
    <FavoriteButton slug={card.slug} onRemoved={() => onRemoved?.(card.slug)} />
          </div>
)}
        <RarityBadge
          rarity={card.rarity as Rarity}
          className="absolute right-3 top-3 bg-white/95"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight text-stone-900">
            {card.card_name}
          </h3>
        </div>

        <dl className="mt-auto flex items-center justify-between gap-2 text-xs text-stone-500">
          <div>
            <dt className="sr-only">{t.cardPage.cardItem.cardNumber}</dt>
            <dd className="font-mono tracking-tight">{card.card_number}</dd>
          </div>
          <div className="text-right">
            <dt className="sr-only">{t.cardPage.cardItem.expansionPack}</dt>
            <dd className="line-clamp-1 max-w-34">{card.pack_name}</dd>
          </div>
        </dl>

        <div className="mt-1 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="text-[11px] uppercase tracking-wide text-stone-400">
            {t.cardPage.cardItem.viewDetails}
          </span>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors duration-300 group-hover:bg-[#B23A2F] group-hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}