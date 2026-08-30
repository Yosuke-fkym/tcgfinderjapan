"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock3, ArrowUpRight } from "lucide-react";

import { Shop } from "@/types/types";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";
import { tagColors } from "@/lib/getStoreTagColor";

interface ShopDiscoveryCardProps {
  shop: Shop;
  featured?: boolean;
}

export default function ShopDiscoveryCard({
  shop,
  featured = false,
}: ShopDiscoveryCardProps) {
  const { locale } = useParams();
  const currentLocale = locale as keyof typeof translations;
  const t = getT(currentLocale);

  
  const shopName =
    shop.shop_name_in_langs?.[currentLocale] || shop.shop_name;

  const address =
    shop.shop_address_in_langs?.[currentLocale] || shop.shop_address;

  return (
    <Link
      href={`/${locale}/shop/${shop.shop_id}`}
      className="group block"
    >
      <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden bg-white/5">
          {shop.images.length > 0 ? (
            <Image
              src={shop.images[0]}
              alt={shopName}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-white/10 to-white/2">
              <MapPin className="h-8 w-8 text-white/20" />
            </div>
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

          {/* Featured badge */}
          {featured && (
            <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
              {t.map.shopCard.featured}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border border-white/10 bg-indigo-600 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-sm sm:text-base font-semibold text-white transition-colors group-hover:text-indigo-600">
              {shopName}
            </h3>
          </div>

          <div className="flex items-start gap-2 text-xs leading-5 text-white/45">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
            <span className="line-clamp-1">{address}</span>
          </div>

          {/* Product tags */}
          {shop.productFlags?.length > 0 && (
            <div className="flex gap-1.5 overflow-hidden pt-0.5">
              {shop.productFlags.slice(0, 3).map((flag) => (
                <span
                  key={flag}
                  className={`shrink-0 rounded-md bg- px-2 py-1 text-[10px] ${tagColors[flag.toLocaleLowerCase().replace(" ", '')]}`}
                >
                 {t.admin.shopForm.extras.productTags[flag.replace(" ", '').toLowerCase() as keyof typeof t.admin.shopForm.extras.productTags]}
                </span>
              ))}

              {shop.productFlags.length > 3 && (
                <span className="shrink-0 rounded-md border border-white/10 bg-white/4 px-2 py-1 text-[10px] text-white/30">
                  +{shop.productFlags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Bottom */}
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-3">
            <div className="flex items-center gap-1.5 text-[11px] text-white/35">
              <Clock3 className="h-3.5 w-3.5" />
              <span>
                {shop.isOpen ? t.map.shopCard.openNow : t.map.shopCard.currentlyClosed}
              </span>
            </div>

            <span className="text-[11px] font-medium text-white/40 transition-colors hover:text-indigo-600">
              {t.map.shopCard.viewShop} →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}