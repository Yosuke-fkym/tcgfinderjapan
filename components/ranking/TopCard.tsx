"use client";

import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export function TopCard({ item, index }: any) {
  const medals = ["🥇", "🥈", "🥉"];

  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <Link href={`/shop/${item.shopId}`}>
      <div className="w-full h-full p-4 sm:p-5 rounded-2xl border shadow-sm hover:shadow-md transition cursor-pointer bg-white flex flex-col justify-between">

        {/* TOP */}
        <div className="w-full">
          {/* Medal + Title */}
          <div className="flex items-start justify-between mb-2">
            <span className="text-xl sm:text-2xl">{medals[index]}</span>
          </div>

          {/* Name */}
          <h2 className="font-semibold text-indigo-600 text-base sm:text-lg line-clamp-1">
            {item.shop?.shop_name}
          </h2>

          {/* Rating */}
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center">
            <Star className="text-yellow-500 fill-yellow-500 mr-1" size={14} />
            {item.avg.toFixed(1)} ({item.count} {t.ranking.row.reviews})
          </p>

          {/* Breakdown */}
          <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs mt-2 text-muted-foreground">
            <span className="inline-flex items-center">
              {t.ranking.row.selection}
              <Star className="mx-0.5 fill-yellow-500 text-yellow-500" size={14} />
              {item.avg_selection.toFixed(1)}
            </span>

            <span className="inline-flex items-center">
              {t.ranking.row.price}
              <Star className="mx-0.5 fill-yellow-500 text-yellow-500" size={14} />
              {item.avg_price.toFixed(1)}
            </span>
          </div>

          {/* Address */}
          {item.shop?.shop_address && (
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 flex items-center gap-1 line-clamp-1">
              <MapPin size={12} /> {item.shop.shop_address}
            </p>
          )}

          {/* Description */}
          {item.shop?.description && (
            <p className="text-[11px] sm:text-xs mt-2 text-muted-foreground line-clamp-2">
              {item.shop.description}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4">
          <p className="text-xs sm:text-sm text-blue-600 font-medium hover:underline">
            {t.buttons.viewDetails} →
          </p>
        </div>
      </div>
    </Link>
  );
}