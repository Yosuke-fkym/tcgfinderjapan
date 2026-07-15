import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { RarityBadge } from "@/components/cards/RarityBadge";
import { CardImageDialog } from "@/components/cards/CardImageDialog";
import { AffiliateButtons } from "@/components/cards/AffiliateButtons";
import { RelatedBlogCard } from "@/components/cards/RelatedBlogCard";
import { CardItem } from "@/components/cards/CardItem";
import { Card, Rarity } from "@/types/card";
import { RelatedShops } from "@/components/cards/RelatedShops";
import { FavoriteButton } from "@/components/cards/FavoriteButton";
import { getT } from "@/lib/getT";

interface CardDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getCard(slug: string) {
  const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/cards/${slug}`,
      {
          cache: "no-store",
      }
  );

  if (!res.ok) return null;
  const data = await res.json();

  return data;
}
export async function generateMetadata({ params }: CardDetailPageProps) {
  
   const { slug } = await params;


const result = await getCard(slug);

  if (!result) {
    notFound();
  }

  const {card}: {card: Card} = result;
  

  return {
    title: `${card.card_name} | TCG Finder Japan`,
    description: `${card.card_name} — ${card.card_number}, ${card.rarity}, from ${card.pack_name}.`,
  };
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
 const { locale, slug } = await params;
  const t = getT(locale);

const result = await getCard(slug);

if (!result) {
    notFound();
}

const { card, article, relatedShops } = result;

  if (!card) {
    notFound();
  }

  

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
              <Link href="/cards" className="transition-colors hover:text-stone-800">
               {t.cardPage.cardEncyclopedia}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-stone-800" aria-current="page">
              {card.card_name}
            </li>
          </ol>
        </nav>

        {/* Main section: image + details, 2 columns on desktop */}
        <section className="mb-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <CardImageDialog src={card.card_image as string} name={card.card_name as string} />
            <p className="mt-2 text-center text-xs text-stone-400 lg:text-left">
             {t.cardPage.cardDetails.clickImageToEnlarge}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <RarityBadge rarity={card.rarity as Rarity} className="h-11 w-11 text-xs" />
                <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  {card.rarity}
                </span>
              </div>
            <div className="flex items-start justify-between gap-4">
  <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
    {card.card_name}
  </h1>

  <FavoriteButton slug={card.slug} />
</div>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  {t.cardPage.cardDetails.cardNumber}
                </dt>
                <dd className="mt-1 font-mono text-sm text-stone-800">
                  {card.card_number}
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                 {t.cardPage.cardDetails.packCode}
                </dt>
                <dd className="mt-1 font-mono text-sm text-stone-800">
                  {card.pack_name}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  {t.cardPage.cardDetails.expansionPack}
                </dt>
                <dd className="mt-1 text-sm text-stone-800">
                  {card.pack_name}{" "}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-stone-400">
                  {t.cardPage.cardDetails.illustrator}
                </dt>
                <dd className="mt-1 text-sm text-stone-800">{card.illustrator_name}</dd>
              </div>
            </dl>

            {/* Affiliate section */}
            <AffiliateButtons locale={locale}  affiliateKeywords={card.affiliate_keywords ?? []} cardName={card.card_name} />
          </div>
        </section>

        {/* Related blog section */}
        <section className="mb-12" aria-labelledby="related-blog-heading">
          <h2
            id="related-blog-heading"
            className="mb-4 font-serif text-xl font-semibold text-stone-900"
          >
            {t.cardPage.cardDetails.fromTheBlog}
          </h2>
          {article && ( <RelatedBlogCard post={article!} /> )}

          {relatedShops?.length > 0 && (
  <section
    className="my-12"
    aria-labelledby={t.cardPage.cardDetails.relatedShops}
  >

    <RelatedShops shops={relatedShops} />
  </section>
)}
        </section>
      </div>
    </main>
  );
}