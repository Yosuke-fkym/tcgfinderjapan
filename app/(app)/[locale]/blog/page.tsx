// app/[locale]/blog/page.tsx
// Updated to use shared ArticleCard + ArticleGrid components.

import { ArticleCardData, ArticleGrid } from "@/components/admin/articles/ArticleCard";
import { getT } from "@/lib/getT";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Blog | TCG Finder Japan",
  description:
    "Trading card news, store guides, investment insights, and community updates across Japan.",
  openGraph: {
    title: "TCG Finder Japan Blog",
    description:
      "Trading card news, guides, store information, and industry updates across Japan.",
    type: "website",
  },
};

async function fetchPublishedArticles(): Promise<ArticleCardData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/admin/articles?status=published&orderBy=published_at&order=desc`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params;
  const articles = await fetchPublishedArticles();

const t = getT(locale as string);

  return (
    <main className="min-h-screen bg-[#FAF8F4]">

      {/* ── Hero ── */}
      <header
        className="max-w-6xl mx-auto px-5 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16
                   flex items-end justify-between gap-8 border-b border-stone-200"
      >
        <div>
          <p
            className="flex items-center gap-3 text-[0.72rem] font-semibold tracking-[0.12em]
                       uppercase text-amber-600 mb-5"
          >
            <span className="block w-7 h-px bg-amber-600" aria-hidden="true" />
            {t.blogList.hero.eyebrow}
          </p>

          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900
                       leading-[1.1] tracking-tight mb-4"
          >
            {t.blogList.hero.title.line1}<br />{t.blogList.hero.title.line2}
          </h1>

          <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-md">
            {t.blogList.hero.description}
          </p>
        </div>

        {articles.length > 0 && (
          <div className="hidden sm:block text-right pb-1 flex-shrink-0">
            <span
              className="block font-serif text-7xl font-bold text-stone-900 opacity-[0.07]
                         leading-none tracking-tight select-none"
            >
              {String(articles.length).padStart(2, "0")}
            </span>
            <span className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-stone-400">
              {t.blogList.stats.articles}
            </span>
          </div>
        )}
      </header>

      {/* ── Grid ── */}
      <section
        className="max-w-6xl mx-auto px-5 sm:px-10 py-12 sm:py-16"
        aria-label="Article listing"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleGrid
            articles={articles}
            locale={locale}
            emptyMessage="{t.blogList.grid.emptyMessage}"
          />
        </div>
      </section>

    </main>
  );
}