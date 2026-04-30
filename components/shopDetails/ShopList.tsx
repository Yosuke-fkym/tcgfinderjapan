'use client'
import { isShopOpen } from "@/lib/helpers/getShopStatus";
import { Shop } from "@/types/types";
import { Badge } from "../ui/badge";
import { useRouter, useParams } from "next/navigation";
import { Heart } from "lucide-react";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";

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
      <div className="p-6 text-sm text-gray-500 text-center">
        {t.shopDetails.list.empty}
      </div>
    );
  }

  
  return (
    <div className="">
      {shops.map((shop) => {

        const isSelected = selected?.shop_id === shop.shop_id;
        const isOpen = shop.business_hours && isShopOpen(shop);

        return (
          <div
            key={shop.shop_id}
            id={`shop-${shop.shop_id}`}
            onClick={() => {
              if (selected?.shop_id === shop.shop_id) {
                router.push(`/shop/${shop.shop_id}`);
              } else {
                onSelect(shop);
              }
            }}
            className={`p-4 flex items-start border-b-[0.5px] border-b-[#ffffff42] justify-between gap-3 cursor-pointer transition-all ${
              isSelected
                ? "bg-[#03335b3b]"
                : "hover:bg-[#8125e533]"
            }`}
          >
            {/* LEFT */}
            <div className="flex flex-col gap-1">
              <div className="font-medium text-base text-white">
                {
                  locale === "jp" ?
                  shop.shop_name
                  :
                 shop.shop_name_in_langs && shop.shop_name_in_langs[locale as keyof typeof translations]
                }
              </div>

              <div className="text-xs text-gray-500 line-clamp-1">
                {
                  locale === "jp" ?
                  shop.shop_address
                  :
                 shop.shop_address_in_langs && shop?.shop_address_in_langs[locale as keyof typeof translations]
                }
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-2">
              {/* ❤️ */}
              <button
                aria-label={
                  favorites.includes(shop.shop_id)
                    ? t.shopDetails.list.removeFromFavorites
                    : t.shopDetails.list.addToFavorites
                }
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(shop.shop_id);
                }}
              >
                {favorites.includes(shop.shop_id) ? (
                  <Heart fill="currentColor" className="fill-red-600 text-red-600" />
                ) : (
                  <Heart className="text-gray-400" />
                )}
              </button>

              {/* status */}
              {isOpen ? (
                <Badge className="bg-green-50 text-green-700 border border-green-200">
                  {t.shopDetails.header.open}
                </Badge>
              ) : (
                <Badge className="bg-red-50 text-red-700 border border-red-200">
                  {t.shopDetails.header.closed}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}