import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Pack } from "@/types/pack";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface PackItemProps {
  pack: Pack;
}

/**
 * Mirrors CardItem 1:1: the whole card is a single focusable Link so
 * keyboard/screen-reader users get the same affordance as mouse users.
 */
export function PackItem({ pack }: PackItemProps) {
  const { locale } = useParams();
  const t = getT(locale as string);

  const formattedDate = pack.release_date
    ? new Date(pack.release_date).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/packs/${pack.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B23A2F]/50"
      aria-label={`${pack.name_en}, ${pack.name_jp}`}
    >
      <div className="relative aspect-5/7 w-full overflow-hidden bg-stone-100">
        {pack.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pack.image_url}
            alt={`${pack.name_en} ${t.packPage.packItem.packArt}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-300">
            <CalendarDays className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight text-stone-900">
            {pack.name_jp}
          </h3>
          <p className="mt-0.5 text-sm text-stone-500">{pack.name_en}</p>
        </div>

        <dl className="mt-auto flex items-center justify-between gap-2 text-xs text-stone-500">
          <div>
            <dt className="sr-only">{t.packPage.packItem.releaseDate}</dt>
            <dd className="font-mono tracking-tight">{formattedDate ?? "—"}</dd>
          </div>
        </dl>

        <div className="mt-1 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="text-[11px] uppercase tracking-wide text-stone-400">
            {t.packPage.packItem.viewDetails}
          </span>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors duration-300 group-hover:bg-[#B23A2F] group-hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}