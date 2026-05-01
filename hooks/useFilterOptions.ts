import { useMemo } from "react";
import { Shop } from "@/types/types";
import { extractArea } from "@/lib/helpers/extractArea";
export function useFilterOptions(shops: Shop[], lang: string) {
  return useMemo(() => {
   const areas = Array.from(
  new Set(
    shops
      .map((shop) => extractArea(shop.shop_address))
      .filter(Boolean)
  )
);

    const productFlags = Array.from(
      new Set(
        shops.flatMap((shop) => shop.productFlags || [])
      )
    );

    const languages = Array.from(
      new Set(
        shops.flatMap((shop) =>
          shop.language_support || []
        )
      )
    );

    return {
      areas,
      productFlags,
      languages,
    };
  }, [shops, lang]);
}