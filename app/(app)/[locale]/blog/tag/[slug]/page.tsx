// app/[locale]/blog/tag/[slug]/page.tsx
// Identical structure to /blog/category/[slug] — only hero text and
// data fetching differ. ArticleGrid is shared from components/blog/ArticleCard.

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleCardData, ArticleGrid } from "@/components/admin/articles/ArticleCard";
import { getT } from "@/lib/getT";
import VerticalAdBanner from "@/components/ads/VerticalAdBanner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchTag(slug: string): Promise<Tag | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/articles/tag/${slug}`, {
    cache: "no-store",
  });
  
  if (!res.ok) return null;
  const { data } = await res.json();
  return data ?? null;
}

async function fetchArticlesByTag(tagSlug: string): Promise<ArticleCardData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/admin/articles?status=published&tag=${tagSlug}&orderBy=published_at&order=desc`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await fetchTag(slug);
  if (!tag) return { title: "Tag Not Found" };

  return {
    title: `${tag.name} Articles | TCG Finder Japan`,
    description: `Browse all articles tagged with ${tag.name} on TCG Finder Japan.`,
    openGraph: {
      title: `${tag.name} Articles | TCG Finder Japan`,
      description: `Browse all articles tagged with ${tag.name} on TCG Finder Japan.`,
      type: "website",
      images: [
        {
          url: `/og.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TagPage({ params }: Props) {
  const { slug, locale } = await params;

const t = getT(locale as string);

  const [tag, articles] = await Promise.all([
    fetchTag(slug),
    fetchArticlesByTag(slug),
  ]);

  if (!tag) notFound();

  return (
    <main className="min-h-screen bg-[#FAF8F4]">

      {/* ── Hero ── */}
      <header
        className="max-w-6xl mx-auto px-5 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16
                   flex items-end justify-between gap-8 border-b border-stone-200"
      >
        <div>
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-[0.72rem] text-stone-400 mb-5"
            aria-label="Breadcrumb"
          >
            <Link href={`/${locale}/blog`} className="hover:text-amber-600 transition-colors">
              {t.blogTag.breadcrumb.blog}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-stone-500">{t.blogTag.breadcrumb.tag}</span>
            <span aria-hidden="true">›</span>
            <span className="text-stone-600 font-medium">{tag.name}</span>
          </nav>

          {/* Eyebrow */}
          <p
            className="flex items-center gap-3 text-[0.72rem] font-semibold tracking-[0.12em]
                       uppercase text-amber-600 mb-5"
          >
            <span className="block w-7 h-px bg-amber-600" aria-hidden="true" />
            {t.blogTag.hero.label}
          </p>

          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900
                       leading-[1.1] tracking-tight mb-4"
          >
            {tag.name}<br />
            <span className="text-stone-300">{t.blogTag.hero.articles}</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-md">
            {t.blogTag.hero.description.replace("{tag}", tag.name)}
          </p>
        </div>

        {/* Decorative article count — same as blog + category pages */}
        <div className="hidden sm:block text-right pb-1 flex-shrink-0">
          <span
            className="block font-serif text-7xl font-bold text-stone-900 opacity-[0.07]
                       leading-none tracking-tight select-none"
          >
            {String(articles.length).padStart(2, "0")}
          </span>
          <span className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-stone-400">
            {t.blogCategory.stats.articles}
          </span>
        </div>
      </header>

      {/* ── Grid ── */}
      <section
        className="max-w-6xl mx-auto px-5 sm:px-10 py-12 sm:py-16"
        aria-label={`${tag.name} articles`}
      >
        <div className="max-w-5xl mx-auto my-8">
      <VerticalAdBanner position="center"/>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleGrid
          noArticles={t.blogList.grid.noArticlesYet}
            articles={articles}
            locale={locale}
            emptyMessage={t.blogTag.grid.emptyMessage.replace("{tag}", tag.name)}
          />
        </div>
      </section>

    </main>
  );
}