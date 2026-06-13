// app/[locale]/blog/page.tsx
// Supports ?category= filtering + featured articles editorial section.

import { ArticleCardData, ArticleGrid } from "@/components/admin/articles/ArticleCard";
import { CategoryFilter, CategoryOption } from "@/components/admin/articles/CategoryFilter";
import { FeaturedArticlesSection } from "@/components/admin/articles/FeaturedArticles";
import { getT } from "@/lib/getT";
import { Metadata } from "next";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

// ─── Metadata ────────────────────────────────────────────────────────────────

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

// ─── Data fetchers ────────────────────────────────────────────────────────────

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

async function fetchCategories(): Promise<CategoryOption[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/articles/category`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  const raw: { id: string; name: string; slug: string }[] =
    Array.isArray(json) ? json : (json.data ?? []);
  return raw.map(({ slug, name }) => ({ slug, name }));
}

// ─── Locale helpers ───────────────────────────────────────────────────────────

function getFilterLabels(locale: string) {
  if (locale === "ja") {
    return { all: "全カテゴリー", placeholder: "カテゴリー" };
  }
  return { all: "All Categories", placeholder: "Category" };
}

function getFeaturedHeading(locale: string) {
  return locale === "ja" ? "特集記事" : "Featured";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;

  const [articles, categories] = await Promise.all([
    fetchPublishedArticles(categorySlug),
    fetchCategories(),
  ]);

  const t = getT(locale as string);
  const filterLabels = getFilterLabels(locale);

  // Split articles into featured vs normal.
  // When a category filter is active, suppress the featured section:
  // a filtered view should show all matching results uniformly.
  const isCategoryFiltered = Boolean(categorySlug);
  const featuredArticles = isCategoryFiltered
    ? []
    : articles.filter((a) => (a as any).is_featured === true).slice(0, 3);
  const normalArticles = isCategoryFiltered
    ? articles
    : articles.filter((a) => !(a as any).is_featured);

  return (
    <main className="min-h-screen bg-[#FAF8F4]">

      {/* ── Hero ── */}
      <header
        className="max-w-6xl mx-auto px-5 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16
                   flex items-end justify-between gap-8 border-b border-stone-200"
      >
        <div>
          <p
            className="flex items-center gap-3 text-[0.72rem] font-semibold
                       tracking-[0.12em] uppercase text-amber-600 mb-5"
          >
            <span className="block w-7 h-px bg-amber-600" aria-hidden="true" />
            {t.blogList.hero.eyebrow}
          </p>

          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold
                       text-stone-900 leading-[1.1] tracking-tight mb-4"
          >
            {t.blogList.hero.title.line1}
            <br />
            {t.blogList.hero.title.line2}
          </h1>

          <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-md">
            {t.blogList.hero.description}
          </p>
        </div>

        {articles.length > 0 && (
          <div className="hidden sm:block text-right pb-1 flex-shrink-0">
            <span
              className="block font-serif text-7xl font-bold text-stone-900
                         opacity-[0.07] leading-none tracking-tight select-none"
            >
              {String(articles.length).padStart(2, "0")}
            </span>
            <span
              className="text-[0.68rem] font-semibold tracking-[0.1em]
                         uppercase text-stone-400"
            >
              {t.blogList.stats.articles}
            </span>
          </div>
        )}
      </header>

      {/* ── Featured Articles ── */}
      {/*
        Hidden when a category filter is active (uniform filtered results are
        better UX than a mixed featured + grid layout in that state).
      */}
      {featuredArticles.length > 0 && (
        <FeaturedArticlesSection
          articles={featuredArticles}
          locale={locale}
          heading={getFeaturedHeading(locale)}
        />
      )}

      {/* ── Category Filter Bar ── */}
      <div
        className={`max-w-6xl mx-auto px-5 sm:px-10 ${
          featuredArticles.length > 0 ? "pt-10 sm:pt-14" : "pt-6 sm:pt-8"
        }`}
      >
        <CategoryFilter
          categories={categories}
          selectedSlug={categorySlug}
          labels={filterLabels}
        />
      </div>

      {/* ── All Articles Grid ── */}
      <section
        className="max-w-6xl mx-auto px-5 sm:px-10 py-10 sm:py-14"
        aria-label="Article listing"
      >
        {/*
          Section label only shown when there are featured articles above,
          so readers understand this is the "everything else" section.
        */}
        {featuredArticles.length > 0 && !isCategoryFiltered && (
          <div className="flex items-center gap-4 mb-7">
            <span
              className="text-[0.68rem] font-semibold tracking-[0.14em]
                         uppercase text-stone-400"
            >
              {locale === "ja" ? "すべての記事" : "All Articles"}
            </span>
            <span className="flex-1 h-px bg-stone-200" aria-hidden="true" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleGrid
          noArticles={t.blogList.grid.noArticlesYet}
            articles={normalArticles}
            locale={locale}
            emptyMessage={t.blogList.grid.emptyMessage}
          />
        </div>
      </section>

    </main>
  );
}