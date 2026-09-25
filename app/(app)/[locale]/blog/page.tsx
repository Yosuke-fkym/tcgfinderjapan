// app/[locale]/blog/page.tsx
// Supports ?category= filtering + featured articles editorial section.

import {
  ArticleCardData,
  ArticleGrid,
} from "@/components/admin/articles/ArticleCard";
import {
  CategoryFilter,
  CategoryOption,
} from "@/components/admin/articles/CategoryFilter";
import { FeaturedArticlesSection } from "@/components/admin/articles/FeaturedArticles";
import headerImg from "@/assets/header-img.png";
// import VerticalAdBanner from "@/components/ads/VerticalAdBanner";
import { getT } from "@/lib/getT";
import { Metadata } from "next";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const canonical = `${baseUrl}/${locale}/blog`;

  const title =
    locale === "jp" ? "ブログ | TCG Finder Japan" : "Blog | TCG Finder Japan";

  const description =
    locale === "jp"
      ? "日本全国のトレーディングカードニュース、ショップガイド、投資情報、コミュニティ情報をご紹介します。"
      : "Trading card news, store guides, investment insights, and community updates across Japan.";

  return {
    title,
    description,

    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/blog`,
        ja: `${baseUrl}/jp/blog`,
      },
    },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "TCG Finder Japan",
      locale: locale === "jp" ? "ja_JP" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function fetchPublishedArticles(
  categorySlug?: string,
): Promise<ArticleCardData[]> {
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
  const raw: { id: string; name: string; slug: string }[] = Array.isArray(json)
    ? json
    : (json.data ?? []);
  return raw.map(({ slug, name }) => ({ slug, name }));
}

// ─── Locale helpers ───────────────────────────────────────────────────────────

function getFilterLabels(uiLocale: string) {
  if (uiLocale === "jp") {
    return { all: "全カテゴリー", placeholder: "カテゴリー" };
  }
  return { all: "All Categories", placeholder: "Category" };
}

function getFeaturedHeading(uiLocale: string) {
  return uiLocale === "jp" ? "特集記事" : "Featured";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const uiLocale = locale === "jp" ? "en" : locale;
  const { category: categorySlug } = await searchParams;

  const [articles, categories] = await Promise.all([
    fetchPublishedArticles(categorySlug),
    fetchCategories(),
  ]);

  const t = getT(uiLocale as string);
  const filterLabels = getFilterLabels(uiLocale);

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
      <div className="relative h-full flex flex-col justify-center p-8 w-full overflow-hidden">
        <div className="absolute z-1 bg-black/70 top-0 left-0 h-full w-full" />
        <img
          src={headerImg.src}
          alt={t.blogArticle.hero.imageAlt}
          className="absolute top-0 w-full xl:h-auto h-full object-cover left-0 z-0 xl:-translate-y-75"
        />
        <header
          className="max-w-6xl w-full mx-auto px-5 relative z-2 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16
                   flex items-end justify-between gap-8"
        >
          <div>
            <p
              className="flex items-center gap-3 text-[0.72rem] font-semibold
                       tracking-[0.12em] uppercase text-amber-600 mb-5"
            >
              <span
                className="block w-7 h-px bg-amber-600"
                aria-hidden="true"
              />
              {t.blogList.hero.eyebrow}
            </p>

            <h1
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold
                       text-white leading-[1.1] tracking-tight mb-4"
            >
              {t.blogList.hero.title.line1}
              <br />
              {t.blogList.hero.title.line2}
            </h1>

            <p className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-md">
              {t.blogList.hero.description}
            </p>
          </div>

          {articles.length > 0 && (
            <div className="hidden sm:block text-right pb-1 shrink-0">
              <span
                className="block font-serif text-7xl font-bold text-stone-400
                         leading-none tracking-tight select-none"
              >
                {String(articles.length).padStart(2, "0")}
              </span>
              <span
                className="text-[0.68rem] font-semibold tracking-widest
                         uppercase text-stone-400"
              >
                {t.blogList.stats.articles}
              </span>
            </div>
          )}
        </header>
      </div>
      <div className="max-w-5xl mx-auto my-8">
        {/* <VerticalAdBanner position="center"/> */}
      </div>
      {/* ── Featured Articles ── */}
      {/*
        Hidden when a category filter is active (uniform filtered results are
        better UX than a mixed featured + grid layout in that state).
      */}
      {featuredArticles.length > 0 && (
        <FeaturedArticlesSection
          articles={featuredArticles}
          locale={locale}
          heading={getFeaturedHeading(uiLocale)}
        />
      )}
      <div className="max-w-5xl mx-auto my-8">
        {/* <VerticalAdBanner position="center"/> */}
      </div>

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
        aria-label={t.blogList.grid.ariaLabel}
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
              {t.blogList.hero.allArticles}
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
