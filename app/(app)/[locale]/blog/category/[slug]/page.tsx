// app/[locale]/blog/category/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleCardData, ArticleGrid } from "@/components/admin/articles/ArticleCard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = {
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

async function fetchCategory(slug: string): Promise<Category | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/articles/category/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data ?? null;
}

async function fetchArticlesByCategory(categorySlug: string): Promise<ArticleCardData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/admin/articles?status=published&category=${categorySlug}&orderBy=published_at&order=desc`,
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
  const category = await fetchCategory(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Articles | TCG Finder Japan`,
    description: `Browse ${category.name}-related articles, guides, news, and insights on TCG Finder Japan.`,
    openGraph: {
      title: `${category.name} Articles | TCG Finder Japan`,
      description: `Browse ${category.name}-related articles, guides, news, and insights on TCG Finder Japan.`,
      type: "website",
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CategoryPage({ params }: Props) {
  const { slug, locale } = await params;

  const [category, articles] = await Promise.all([
    fetchCategory(slug),
    fetchArticlesByCategory(slug),
  ]);

  if (!category) notFound();

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
            <Link
              href={`/${locale}/blog`}
              className="hover:text-amber-600 transition-colors"
            >
              Blog
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-stone-600 font-medium">{category.name}</span>
          </nav>

          {/* Eyebrow */}
          <p
            className="flex items-center gap-3 text-[0.72rem] font-semibold tracking-[0.12em]
                       uppercase text-amber-600 mb-5"
          >
            <span className="block w-7 h-px bg-amber-600" aria-hidden="true" />
            Category
          </p>

          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900
                       leading-[1.1] tracking-tight mb-4"
          >
            {category.name}<br />
            <span className="text-stone-300">Articles</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-md">
            Browse all articles related to {category.name} cards, market insights, store guides,
            and community updates.
          </p>
        </div>

        {/* Article count — decorative, mirrors blog list page */}
        <div className="hidden sm:block text-right pb-1 flex-shrink-0">
          <span
            className="block font-serif text-7xl font-bold text-stone-900 opacity-[0.07]
                       leading-none tracking-tight select-none"
          >
            {String(articles.length).padStart(2, "0")}
          </span>
          <span className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-stone-400">
            Articles
          </span>
        </div>
      </header>

      {/* ── Grid ── */}
      <section
        className="max-w-6xl mx-auto px-5 sm:px-10 py-12 sm:py-16"
        aria-label={`${category.name} articles`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleGrid
            articles={articles}
            locale={locale}
            emptyMessage={`No articles have been published in ${category.name} yet. Check back soon.`}
          />
        </div>
      </section>

    </main>
  );
}