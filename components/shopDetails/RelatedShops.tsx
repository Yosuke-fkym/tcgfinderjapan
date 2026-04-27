'use client'

import { getT } from "@/lib/getT";
import { Shop } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface RelatedShopsProps {
  shops: Shop[];
}

export default function RelatedShops({ shops }: RelatedShopsProps) {
  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

  if (!shops || shops.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Title */}
      <div>
        <h2 className="text-sm text-white">
          {t.shopDetails.related.title}
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.slice(0, 4).map((shop) => (
          <Card
            key={shop.shop_id}
            className="group pt-0 cursor-pointer overflow-hidden border shadow-sm hover:shadow-md transition"
            onClick={() => router.push(`/${locale}/shop/${shop.shop_id}`)}
          >
            <div className="relative">
              {/* Image */}
              <Image
                height={160}
                width={256}
                alt={shop.shop_name}
                src={
                  shop.images?.[0] || "/placeholder.jpg"
                }
                className="h-40 w-full object-cover"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </div>

            <CardContent className="p-2 pt-0">
              <p className="font-semibold text-indigo-600 line-clamp-1">
                {shop.shop_name}
              </p>

              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {shop.shop_address || t.common.unknownLocation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}