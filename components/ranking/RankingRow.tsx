"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { RankBadge } from "./RankBadge";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";
import Image from "next/image";

export function RankingRow({ item, index }: any) {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <Link href={`/shop/${item.shopId}`}>
      <div className="flex items-center justify-between p-4 my-4 rounded-xl bg-white shadow-sm border hover:shadow-md transition cursor-pointer">

        <div className="flex items-center gap-4">

  <RankBadge index={index} />

  {/* Icon */}
  {item.shop?.shop_icon_url ? (
    <Image
    width={48} height={48}
      src={item.shop.shop_icon_url}
      alt={item.shop.shop_name}
      className="w-12 h-12 rounded-full object-cover border shrink-0"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 font-bold border shrink-0">
      {item.shop?.shop_name?.[0]}
    </div>
  )}
<div>
            <p className="font-medium text-indigo-600">
              {
                // locale === "jp" ?
                // item.shop?.shop_name
                // :
               item.shop?.shop_name_in_langs && item.shop?.shop_name_in_langs[locale as keyof typeof translations]
              }
            </p>

            {/* Overall */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star
                size={14}
                className="fill-yellow-500 text-yellow-500"
              />
              {item.avg.toFixed(1)} ({item.count} {t.ranking.row.reviews})
            </div>
  <div>
    </div>
    {/* ...baaki sab same */}
        {/* Breakdown */}
            <div className="text-xs text-muted-foreground mt-1 flex gap-3">
              <span className="inline-flex items-center">
                {t.ranking.row.selection}: 
                <Star className="inline fill-yellow-500 text-yellow-500 mx-0.5" size={15}/>
                {item.avg_selection.toFixed(1)}
              </span>

              <span className="inline-flex items-center">
                {t.ranking.row.price}
                <Star className="inline fill-yellow-500 text-yellow-500 mx-0.5" size={15}/> 
                {item.avg_price.toFixed(1)}
              </span>
            </div>
  </div>
</div>
        {/* Score */}
        <div className="text-xs text-muted-foreground">
          {t.ranking.row.score}: {item.score.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}