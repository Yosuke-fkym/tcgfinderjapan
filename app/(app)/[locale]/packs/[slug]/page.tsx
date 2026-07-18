import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CalendarDays } from "lucide-react";

import { CardGrid } from "@/components/cards/CardGrid";
import type { Pack } from "@/types/pack";
import type { Card } from "@/types/card";
import { getT } from "@/lib/getT";

interface PackDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getPack(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/packs/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  const data = await res.json();

  return data;
}

export async function generateMetadata({ params }: PackDetailPageProps) {
  const { slug } = await params;

  const result = await getPack(slug);

  if (!result) {
    notFound();
  }

  const { pack }: { pack: Pack } = result;

  return {
    title: `${pack.name_en} | TCG Finder Japan`,
    description: `${pack.name_en} (${pack.name_jp}) expansion pack — browse all cards included.`,
  };
}

export default async function PackDetailPage({ params }: PackDetailPageProps) {
  const { locale, slug } = await params;
  const t = getT(locale);

  const result = await getPack(slug);

  if (!result) {
    notFound();
  }

  const { pack, cards }: { pack: Pack; cards: Card[] } = result;

  if (!pack) {
    notFound();
  }

  const formattedDate = pack.release_date
    ? new Date(pack.release_date).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500">
            <li>
              <Link href="/" className="transition-colors hover:text-stone-800">
                {t.cardPage.home}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/packs" className="transition-colors hover:text-stone-800">
                {t.packPage.packEncyclopedia}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-stone-800" aria-current="page">
              {pack.name_en}
            </li>
          </ol>
        </nav>

        {/* Main section: image + details, 2 columns on desktop */}
        <section className="mb-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="relative aspect-5/7 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              {pack.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pack.image_url}
                  alt={pack.name_en}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-300">
                  <CalendarDays className="h-10 w-10" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
                {t.packPage.packDetails.expansionPack}
              </span>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {pack.name_jp}
              </h1>
              <p className="mt-1 text-lg text-stone-500">{pack.name_en}</p>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  {t.packPage.packDetails.nameJapanese}
                </dt>
                <dd className="mt-1 text-sm text-stone-800">{pack.name_jp}</dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  {t.packPage.packDetails.nameEnglish}
                </dt>
                <dd className="mt-1 text-sm text-stone-800">{pack.name_en}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  {t.packPage.packDetails.releaseDate}
                </dt>
                <dd className="mt-1 font-mono text-sm text-stone-800">
                  {formattedDate ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Cards in this pack */}
        <section aria-labelledby="pack-cards-heading">
          <h2
            id="pack-cards-heading"
            className="mb-4 font-serif text-xl font-semibold text-stone-900"
          >
            {t.packPage.packDetails.cardsInThisPack}
          </h2>

          <CardGrid cards={cards ?? []} />
        </section>
      </div>
    </main>
  );
}