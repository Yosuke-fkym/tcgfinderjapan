"use client";

import { ShopVideo } from "@/types/types";
import { VideoCard } from "./VideoCard";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export function ShopVideosSection({ videos }: { videos: ShopVideo[] }) {
  const { locale } = useParams();
  const t = getT(locale as string);

  if (!videos.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-sm text-white mb-4">
        {t.shopDetails.videos.title}
      </h2>

      <div className="flex gap-4 justify-center items-center w-full overflow-x-hidden flex-wrap pb-2">
        {videos.map((video) => (
          <VideoCard key={video.id} url={video.videoUrl} />
        ))}
      </div>
    </section>
  );
}