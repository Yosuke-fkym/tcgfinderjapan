'use client'
import { isShopOpen } from "@/lib/helpers/getShopStatus";
import { Shop } from "@/types/types";
import { Badge } from "../ui/badge";
import { useRouter, useParams } from "next/navigation";
import { Heart, Store, ChevronRight } from "lucide-react";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";
import Image from "next/image";

interface ShopListProps {
  onSelect: (shop: Shop) => void;
  selected: Shop | null;
  shops: Shop[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function ShopList({
  onSelect,
  selected,
  shops,
  favorites,
  toggleFavorite
}: ShopListProps) {
  const router = useRouter();

  const { locale } = useParams();
  const t = getT(locale as string);

  if (shops.length === 0) {
    return (
      <div className="p-10 text-sm text-white/40 text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <Store className="w-5 h-5 text-white/25" />
        </div>
        {t.shopDetails.list.empty}
      </div>
    );
  }

  return (
    <div>
      {shops.map((shop) => {
        const isSelected = selected?.shop_id === shop.shop_id;
        const isOpen = shop.business_hours && isShopOpen(shop);
        const isFav = favorites.includes(shop.shop_id);

        return (
          <div
            key={shop.shop_id}
            id={`shop-${shop.shop_id}`}
            onClick={() => {
              if (selected?.shop_id === shop.shop_id) {
                router.push(`shop/${shop.shop_id}`);
              } else {
                onSelect(shop);
              }
            }}
            className={`group relative flex items-start justify-between gap-3 p-4 pl-5 border-b border-white/[0.06] cursor-pointer transition-colors duration-200 ${
              isSelected
                ? "bg-indigo-600/[0.10]"
                : "hover:bg-white/[0.035]"
            }`}
          >
            {/* selected accent bar */}
            <span
              className={`absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 transition-opacity duration-200 ${
                isSelected ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* LEFT */}
            <div className="flex items-start gap-3 min-w-0">
              {/* SHOP ICON */}
              <div
                className={`w-11 h-11 rounded-full shrink-0 overflow-hidden bg-white/[0.04] flex items-center justify-center ring-1 transition-colors duration-200 ${
                  isSelected
                    ? "ring-indigo-500/40"
                    : "ring-white/10 group-hover:ring-white/20"
                }`}
              >
                {shop.shop_icon_url ? (
                  <Image
                    src={shop.shop_icon_url}
                    alt={shop.shop_name}
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Store size={17} className="text-white/30" />
                )}
              </div>

              {/* NAME + ADDRESS */}
              <div className="flex flex-col gap-1 min-w-0 pt-0.5">
                <h1 className="font-medium text-[15px] text-white truncate">
                  {(shop.shop_name_in_langs &&
                    shop.shop_name_in_langs[locale as keyof typeof translations]) ||
                    shop.shop_name}
                </h1>
                <p className="text-xs text-white/40 line-clamp-1">
                  {(shop.shop_address_in_langs &&
                    shop?.shop_address_in_langs[locale as keyof typeof translations]) ||
                    shop.shop_address}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-2.5 shrink-0">
              <button
                aria-label={
                  isFav
                    ? t.shopDetails.list.removeFromFavorites
                    : t.shopDetails.list.addToFavorites
                }
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(shop.shop_id);
                }}
                className="p-1 -m-1 rounded-full hover:bg-white/[0.06] transition-colors"
              >
                {isFav ? (
                  <Heart size={18} fill="currentColor" className="text-red-500" />
                ) : (
                  <Heart size={18} className="text-white/30 hover:text-white/50 transition-colors" />
                )}
              </button>

              {isOpen ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 gap-1.5 font-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {t.shopDetails.header.open}
                </Badge>
              ) : (
                <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 gap-1.5 font-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {t.shopDetails.header.closed}
                </Badge>
              )}
            </div>

            {/* subtle chevron on selected, hints tap-to-open */}
            {isSelected && (
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400/50" />
            )}
          </div>
        );
      })}
    </div>
  );
}