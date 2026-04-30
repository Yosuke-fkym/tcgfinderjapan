"use client";

import { Shop } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";

interface ShopHeaderProps {
  shop: Shop;
}

export default function ShopHeader({ shop }: ShopHeaderProps) {
  const { locale } = useParams();
  const t = getT(locale as string);
  
  return (
    <div className="space-y-3">

      <div className="flex items-start justify-between gap-3">

        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-white">
            {
              locale === "jp" ?
              shop.shop_name
              :
             shop.shop_name_in_langs && shop.shop_name_in_langs[locale as keyof typeof translations]
            }
          </h1>

          <p className="text-sm text-gray-500">
            {
              locale === "jp" ?
              shop.shop_address
              :   
              shop.shop_address_in_langs && shop.shop_address_in_langs[locale as keyof typeof translations]
            }
          </p>
        </div>

        <div className="shrink-0">
          {shop.isOpen ? (
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

      {shop.productFlags && shop.productFlags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {shop.productFlags.map((flag) => (
            <Badge
              key={flag}
              className="bg-indigo-600 text-white"
            >
              {t.admin.shopForm.extras.productTags[flag.toLowerCase() as keyof typeof t.admin.shopForm.extras.productTags]}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}