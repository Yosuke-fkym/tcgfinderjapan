// components/blog/FeaturedArticlesSection.tsx
// Server component — no client hooks. Pure display.
// Editorial layout: first article = full-width lead, remaining = sidebar column.

import { ArticleCardData } from "@/components/admin/articles/ArticleCard";
import Image from "next/image";
import Link from "next/link";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Rough reading time: ~200 words/min. Falls back gracefully if no content. */
function readingTime(article: ArticleCardData, locale: string): string {
  const words =
    typeof (article as any).content === "string"
      ? (article as any).content.trim().split(/\s+/).length
      : typeof (article as any).reading_time_minutes === "number"
        ? null // use pre-computed value below
        : 0;

  const minutes: number =
    typeof (article as any).reading_time_minutes === "number"
      ? (article as any).reading_time_minutes
      : words
        ? Math.max(1, Math.round(words / 200))
        : 3; // sensible fallback

  return locale === "ja" ? `約${minutes}分` : `${minutes} min read`;
}

function categoryLabel(article: ArticleCardData): string | null {
  return (
    (article as any).category?.name ??
    (article as any).category_name ??
    null
  );
}

function articleHref(article: ArticleCardData, locale: string): string {
  return `/${locale}/blog/${(article as any).slug ?? article.id}`;
}

// ─── Editor's Pick badge ──────────────────────────────────────────────────────

function EditorBadge({ locale }: { locale: string }) {
  const label = locale === "ja" ? "編集部のおすすめ" : "Editor's Pick";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold
                 tracking-[0.14em] uppercase text-amber-700 select-none"
    >
      {/* Fine horizontal rule before the label — echoes the hero eyebrow style */}
      <span className="block w-5 h-px bg-amber-600" aria-hidden="true" />
      {label}
    </span>
  );
}

// ─── Lead article (first featured) ───────────────────────────────────────────
// Full-width, image on the left, content on the right.

function LeadArticle({
  article,
  locale,
}: {
  article: ArticleCardData;
  locale: string;
}) {
  const cat = categoryLabel(article);
  const href = articleHref(article, locale);
  const thumbnail = (article as any).thumbnail_url ?? (article as any).cover_image ?? null;
  const excerpt = (article as any).excerpt ?? (article as any).description ?? "";
  const publishedAt = (article as any).published_at ?? (article as any).created_at ?? "";

  return (
    <article className="group">
      <Link
        href={href}
        className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[55fr_45fr]
                   gap-0 overflow-hidden rounded-sm border border-stone-200
                   bg-white transition-all duration-300
                   hover:border-stone-300 hover:shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
        aria-label={`Read: ${article.title}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 ease-out
                         group-hover:scale-[1.03]"
              priority
            />
          ) : (
            /* Elegant placeholder when no thumbnail exists */
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
              <span
                className="font-serif text-5xl font-bold text-stone-300 leading-none
                           select-none tracking-tight"
              >
                {article.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="flex flex-col justify-between px-7 py-7 sm:px-9 sm:py-9
                     lg:px-10 lg:py-10 border-t md:border-t-0 md:border-l
                     border-stone-200"
        >
          <div>
            {/* Category + badge row */}
            <div className="flex items-center justify-between mb-5">
              {cat && (
                <span
                  className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase
                             text-amber-700 bg-amber-50 px-2.5 py-1 rounded-sm"
                >
                  {cat}
                </span>
              )}
              <EditorBadge locale={locale} />
            </div>

            {/* Title */}
            <h2
              className="font-serif text-2xl sm:text-3xl lg:text-[1.75rem] font-bold
                         text-stone-900 leading-[1.2] tracking-tight mb-4
                         group-hover:text-amber-800 transition-colors duration-200"
            >
              {article.title}
            </h2>

            {/* Excerpt */}
            {excerpt && (
              <p
                className="text-sm text-stone-500 leading-relaxed line-clamp-3"
              >
                {excerpt}
              </p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-stone-100">
            {publishedAt && (
              <time
                dateTime={publishedAt}
                className="text-[0.72rem] text-stone-400 tracking-wide"
              >
                {formatDate(publishedAt, locale)}
              </time>
            )}
            <span className="text-stone-200 select-none">·</span>
            <span className="text-[0.72rem] text-stone-400 tracking-wide">
              {readingTime(article, locale)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

// ─── Secondary featured article (sidebar slot) ───────────────────────────────
// Compact horizontal card: small thumbnail on the left.

function SidebarArticle({
  article,
  locale,
}: {
  article: ArticleCardData;
  locale: string;
}) {
  const cat = categoryLabel(article);
  const href = articleHref(article, locale);
  const thumbnail = (article as any).thumbnail_url ?? (article as any).cover_image ?? null;
  const publishedAt = (article as any).published_at ?? (article as any).created_at ?? "";

  return (
    <article className="group">
      <Link
        href={href}
        className="flex gap-4 p-5 bg-white border border-stone-200 rounded-sm
                   transition-all duration-300
                   hover:border-stone-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
        aria-label={`Read: ${article.title}`}
      >
        {/* Small thumbnail */}
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-stone-100 rounded-sm">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={article.title}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-500 ease-out
                         group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-2xl font-bold text-stone-300 select-none">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between min-w-0">
          <div>
            {cat && (
              <span
                className="text-[0.62rem] font-semibold tracking-[0.1em] uppercase
                           text-amber-700 mb-1.5 block"
              >
                {cat}
              </span>
            )}
            <h3
              className="font-serif text-[0.95rem] font-bold text-stone-900
                         leading-[1.25] tracking-tight line-clamp-2
                         group-hover:text-amber-800 transition-colors duration-200"
            >
              {article.title}
            </h3>
          </div>

          {publishedAt && (
            <time
              dateTime={publishedAt}
              className="text-[0.68rem] text-stone-400 tracking-wide mt-2"
            >
              {formatDate(publishedAt, locale)}
            </time>
          )}
        </div>
      </Link>
    </article>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

type Props = {
  articles: ArticleCardData[];
  locale: string;
  /** Localised section heading: "Featured" / "特集記事" */
  heading: string;
};

export function FeaturedArticlesSection({ articles, locale, heading }: Props) {
  if (!articles.length) return null;

  const [lead, ...rest] = articles;

  return (
    <section
      aria-label={heading}
      className="max-w-6xl mx-auto px-5 sm:px-10 pt-10 sm:pt-14 pb-0"
    >
      {/* Section heading — matches the eyebrow pattern used across the page */}
      <div className="flex items-center gap-4 mb-7 sm:mb-9">
        <span
          className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase
                     text-stone-400"
        >
          {heading}
        </span>
        {/* Fine horizontal rule that stretches to fill remaining width */}
        <span className="flex-1 h-px bg-stone-200" aria-hidden="true" />
      </div>

      {rest.length === 0 ? (
        /* ── 1 featured: full-width only ── */
        <LeadArticle article={lead} locale={locale} />
      ) : (
        /* ── 2–3 featured: lead + sidebar ── */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-5">
          <LeadArticle article={lead} locale={locale} />

          {/* Sidebar column: remaining featured articles stacked */}
          <div className="flex flex-col gap-4">
            {rest.map((article) => (
              <SidebarArticle key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}