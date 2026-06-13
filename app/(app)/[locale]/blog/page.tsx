// app/[locale]/blog/page.tsx
// Updated to support ?category= filtering via a server-side fetch + CategoryFilter dropdown.

import { ArticleCardData, ArticleGrid } from "@/components/admin/articles/ArticleCard";
import { CategoryFilter, CategoryOption } from "@/components/admin/articles/CategoryFilter";
import { getT } from "@/lib/getT";
import { Metadata } from "next";

// ─── Types ──────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ locale: string }>;
  /** Next.js App Router automatically provides searchParams for page.tsx files. */
  searchParams: Promise<{ category?: string }>;
};

// ─── Metadata ───────────────────────────────────────────────────────────────

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

// ─── Data fetchers ───────────────────────────────────────────────────────────

async function fetchPublishedArticles(categorySlug?: string): Promise<ArticleCardData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const query = new URLSearchParams({
    status: "published",
    orderBy: "published_at",
    order: "desc",
  });
  if (categorySlug) query.set("category", categorySlug);

  const res = await fetch(`${baseUrl}/api/admin/articles?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
}

/**
 * Fetches all categories that have at least one published article.
 * Adjust the endpoint path if your project exposes categories differently.
 */
async function fetchCategories(): Promise<CategoryOption[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Reuse the articles endpoint to derive unique categories, OR call a dedicated
  // /api/admin/categories endpoint if one exists. The approach below derives
  // categories from the published articles list so it never shows an empty bucket.
  const res = await fetch(
    `${baseUrl}/api/admin/articles/category`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = await res.json();

 // The API returns { data: [...] } — pull the array out directly.
  const raw: { id: string; name: string; slug: string }[] =
    Array.isArray(json) ? json : (json.data ?? []);
 
  // Map to the CategoryOption shape { slug, name } that CategoryFilter expects.
  return raw.map(({ slug, name }) => ({ slug, name }));
}

// ─── Locale-aware filter labels ──────────────────────────────────────────────

function getFilterLabels(locale: string) {
  if (locale === "ja") {
    return { all: "全カテゴリー", placeholder: "カテゴリー" };
  }
  return { all: "All Categories", placeholder: "Category" };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;

  // Parallel fetches — categories list never depends on the selected category.
  const [articles, categories] = await Promise.all([
    fetchPublishedArticles(categorySlug),
    fetchCategories(),
  ]);

  const t = getT(locale as string);
  const filterLabels = getFilterLabels(locale);

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

      {/* ── Category Filter Bar ── */}
      {/*
        Sits between the hero and the article grid.
        The border-b of the hero provides the visual separation above;
        a light top-padding here creates breathing room below the rule.
      */}
      <div className="max-w-6xl mx-auto px-5 sm:px-10 pt-6 sm:pt-8">
        <CategoryFilter
          categories={categories}
          selectedSlug={categorySlug}
          labels={filterLabels}
        />
      </div>

      {/* ── Grid ── */}
      <section
        className="max-w-6xl mx-auto px-5 sm:px-10 py-10 sm:py-14"
        aria-label="Article listing"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleGrid
          noArticles={t.blogList.grid.noArticlesYet}
            articles={articles}
            locale={locale}
            emptyMessage={t.blogList.grid.emptyMessage}
          />
        </div>
      </section>

    </main>
  );
}