// components/blog/ArticleCard.tsx
// Extracted from Blog List page — shared by BlogListPage and CategoryPage.

import Link from "next/link";

export type ArticleCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  published_at: string | null;
  status: string;
  blog_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function ArticleCard({
  article,
  locale,
}: {
  article: ArticleCardData;
  locale: string;
}) {
  const readTime = estimateReadingTime(article.content);

  return (
    <Link
      href={`/${locale}/blog/${article.slug}`}
      aria-label={article.title}
      className="group flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden
                 transition-all duration-200 ease-out
                 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)]"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-stone-100 flex-shrink-0">
        {article.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.thumbnail_url}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
            <span className="text-4xl text-stone-300 select-none">カード</span>
          </div>
        )}

        {article.blog_categories && (
          <span
            className="absolute top-3 left-3 bg-amber-600 text-white text-[0.65rem] font-semibold
                       tracking-widest uppercase px-2.5 py-1 rounded-sm pointer-events-none"
          >
            {article.blog_categories.name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-2">
        <h2 className="font-serif text-[1.05rem] font-semibold text-stone-900 leading-snug">
          {article.title}
        </h2>

        <p className="text-[0.82rem] text-stone-500 leading-relaxed flex-1 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-2 pt-3 mt-1 border-t border-stone-100">
          {article.published_at && (
            <span className="text-[0.72rem] text-stone-400">
              {formatDate(article.published_at)}
            </span>
          )}
          <span className="w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" aria-hidden="true" />
          <span className="text-[0.72rem] text-stone-400">{readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

export function ArticleGrid({
  articles,
  locale,
  emptyMessage = "No articles found.",
}: {
  articles: ArticleCardData[];
  locale: string;
  emptyMessage?: string;
}) {
  if (articles.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center text-center py-24 gap-4">
        <span className="text-6xl text-stone-200 font-serif select-none leading-none mb-2">
          文
        </span>
        <h3 className="font-serif text-xl font-semibold text-stone-800">No articles yet</h3>
        <p className="text-sm text-stone-400 leading-relaxed max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} locale={locale} />
      ))}
    </>
  );
}