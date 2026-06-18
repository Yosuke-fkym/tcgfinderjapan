"use client";

import { useEffect, useState } from "react";
import { Star, Store, TrophyIcon } from "lucide-react";

import dynamic from "next/dynamic";
const TopCard = dynamic(
  () => import("@/components/ranking/TopCard").then((mod) => mod.TopCard)
);
const RankingRow = dynamic(
  () => import("./RankingRow").then((mod) => mod.RankingRow)
);
import RankingFilter from "@/components/ranking/RankingFilter";
import AdBanner from "../ads/VerticalAdBanner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { AREA_OPTIONS } from "@/lib/helpers/areas";
import { translations } from "@/lib/i18n";

interface RankedShop {
  shopId: string;
  avg: number;
  count: number;
  score: number;
  shop: {
    name: string;
    area: string
    description?: string;
    shop_icon_url: string;
  };
}

export default function RankingPageComponent({initialData = []}: {
  initialData: RankedShop[];
}) {
  const [data, setData] = useState<RankedShop[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState("ALL");
  const [tag, setTag] = useState("ALL");
  const [tagOpen, setTagOpen] = useState(false);

  const { locale } = useParams();
  const t = getT(locale as string);


const availableAreas = new Set(
  initialData.map((item) => item.shop?.area).filter(Boolean)
);

const areas = AREA_OPTIONS
  .filter((a) => availableAreas.has(a.value))
  .map((a) => ({
    value: a.value,
    label: t.ranking.areas[a.key as keyof typeof t.ranking.areas],
    group: a.group,
  }));
  

  const tags = [
    { value: "Vintage", label: t.admin.shopForm.extras.productTags.vintage },
    { value: "PSA", label: t.admin.shopForm.extras.productTags.psa },
    { value: "BOX", label: t.admin.shopForm.extras.productTags.box },
    { value: "Pokémon", label: t.admin.shopForm.extras.productTags.pokémon},
    { value: "ONE PIECE", label: t.admin.shopForm.extras.productTags.onepiece},
  ];

  useEffect(() => {
    fetchRanking();
  }, [area, tag]);

  const fetchRanking = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      const isJP = locale === "jp";
if (area !== "ALL") {
  params.append("area", area);
}
      if (tag !== "ALL") params.append("tag", tag);

      const res = await fetch(`/api/shops/ranking?${params.toString()}`);
      const json = await res.json();

      setData(json);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-6 w-full md:py-8 bg-muted/40 min-h-screen space-y-8 md:space-y-10">

      {/* HERO */}
      <div className="text-center space-y-3">
        <TrophyIcon className="mx-auto text-yellow-500" size={32} />

        <h1 className="text-3xl font-bold">
          {t.ranking.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          {t.ranking.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs text-muted-foreground">
          <span>
            <Store className="inline mr-1 text-yellow-600" size={14} /> {data.length} {t.ranking.stats.shops}
          </span>
          <span>
            <Star className="inline mr-1 text-yellow-600" size={14} /> {t.ranking.stats.weighted}
          </span>
        </div>
      </div>

      {/* FILTERS */}
      <RankingFilter
        area={area}
        areas={areas}
        open={open}
        setArea={setArea}
        setOpen={setOpen}
        setTag={setTag}
        setTagOpen={setTagOpen}
        tag={tag}
        tagOpen={tagOpen}
        tags={tags}
      />

      {/* Loading */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>

          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted animate-pulse"
              >
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-gray-300 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
                <div className="w-10 h-4 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && data.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {data.slice(0, 3).map((item, i) => (
              <TopCard key={item.shopId} item={item} index={i} />
            ))}
          </div>

          <AdBanner position="center"/>

          <div className="space-y-3 md:space-y-4">
            {data.slice(3).map((item, index) => (
              <RankingRow key={item.shopId} item={item} index={index + 3} />
            ))}
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && data.length === 0 && (
        <div className="text-center py-12 md:py-20 text-muted-foreground">
          {t.ranking.empty}
        </div>
      )}
    </div>
  );
}