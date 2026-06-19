// app/[locale]/blog/[slug]/page.tsx

import { createHash } from "crypto";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import PasswordGate from "@/components/admin/articles/PasswordGate";
import { getT } from "@/lib/getT";
import VerticalAdBanner from "@/components/ads/VerticalAdBanner";
import { categoryColors } from "@/lib/getArticleCategoryColor";

// ─── Types ────────────────────────────────────────────────────────────────────

type ArticleTag = {
  general_blog_tags: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

// Supabase returns joined one-to-many as arrays even for FK relations —
// we type them as arrays here and normalise after fetching.
type RawArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  published_at: string | null;
  status: string;
  password_hash: string | null;
  is_protected: boolean;
  blog_categories: { id: string; name: string; slug: string }[] | null;
  article_tags: ArticleTag[];
};

type Article = Omit<RawArticle, "blog_categories"> & {
  blog_categories: { id: string; name: string; slug: string } | null;
};

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(`
      id, title, slug, excerpt, content,
      thumbnail_url, published_at, status, is_protected, password_hash,
      blog_categories:category_id ( id, name, slug ),
      article_tags ( general_blog_tags ( id, name, slug ) )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  const raw = data as unknown as RawArticle;

  // Normalise: Supabase may return blog_categories as an array — unwrap to object
  const blog_categories = Array.isArray(raw.blog_categories)
    ? (raw.blog_categories[0] ?? null)
    : (raw.blog_categories ?? null);

  return { ...raw, blog_categories };
}

// ─── Fingerprint ──────────────────────────────────────────────────────────────

function makeFingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

// ─── Access check ─────────────────────────────────────────────────────────────

async function hasValidAccessCookie(slug: string, passwordHash: string): Promise<boolean> {
  const cookieStore = await cookies();
  const value       = cookieStore.get(`tcg_article_${slug}`)?.value;
  if (!value) return false;

  const expected = `granted:${slug}:${makeFingerprint(passwordHash)}`;
  return value === expected;
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// ─── SEO ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) return { title: "Article Not Found" };

  if (article.is_protected) {
    return {
      title: `${article.title} — Protected Article`,
      description: "This article is password protected.",
      openGraph:{
        images: [
        {
          url: `/og.png`,
          width: 1200,
          height: 630,
        },
      ],
      }
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      ...(article.thumbnail_url && {
        images: [{ url: article.thumbnail_url }],
      }),
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticleDetailPage({ params }: Props) {
  const { slug, locale } = await params;

  const article = await fetchArticle(slug);
  if (!article) notFound();

const t = getT(locale as string);

  // ── Gate check (server-side) ──────────────────────────────────────────────
  if (article.is_protected) {
    // Guard: if hash is missing despite is_protected=true, block access
    const unlocked = article.password_hash
      ? await hasValidAccessCookie(slug, article.password_hash)
      : false;

    if (!unlocked) {
      return <PasswordGate slug={slug} articleTitle={article.title} />;
    }
  }

  // ── Render article ────────────────────────────────────────────────────────
  const tags = article.article_tags
    ?.map((at) => at.general_blog_tags)
    .filter(Boolean) ?? [];

    // page.tsx me ye helper add karo (fetchArticle ke neeche)
function sanitizeContent(html: string): string {
  // Tiptap <pre><code> ke andar jo <p> tags inject ho jaate hain unhe newlines se replace karo
  return html
    .replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (_, attrs, inner) => {
      const cleaned = inner
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\n")
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .trim();
      return `<pre><code${attrs}>${cleaned}</code></pre>`;
    });
}

  return (
    <main className="bg-[#FAF8F4] min-h-screen font-sans text-[#0F0F0F]">

      {/* ── Hero ── */}
      <div className="relative w-full h-[520px] sm:h-[380px] overflow-hidden bg-[#0F0F0F]">
        {article.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f0f]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />

        <div className="absolute bottom-0 left-0 right-0 px-[clamp(1.25rem,5vw,4rem)] pb-10 max-w-[900px] mx-auto">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 text-white/65 text-xs font-medium tracking-widest uppercase mb-5 hover:text-white transition-colors"
          >
            ← {t.blogArticle.hero.backToArticles}
          </Link>

          {article.blog_categories && (
            <div>
              <Link
                href={`/${locale}/blog/category/${article.blog_categories.slug}`}
                className={`inline-block text-[0.7rem] font-semibold tracking-[0.09em] uppercase px-3 py-1 rounded-[2px] mb-4 ${categoryColors[
  article.blog_categories.name as keyof typeof categoryColors
]}`}
              >
                {article.blog_categories.name}
              </Link>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4 mt-2">
            <h1 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-white leading-tight tracking-tight">
              {article.title}
            </h1>
            {article.is_protected && (
              <span className="flex-shrink-0 mt-1.5 inline-flex items-center gap-1 bg-white/10 text-white/70 text-[0.65rem] font-medium tracking-wider uppercase px-2 py-0.5 rounded border border-white/20">
                🔒 {t.blogArticle.hero.protected}
              </span>
            )}
          </div>

          {article.published_at && (
            <div className="flex items-center gap-2 text-white/50 text-[0.8rem] font-normal tracking-wide">
              <span>{t.blogArticle.hero.published}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-current" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1100px] mx-auto px-[clamp(1.25rem,5vw,4rem)] pb-20">

        {/* Breadcrumb */}
        <nav
          className="flex flex-wrap items-center gap-1.5 py-5 text-xs text-[#9A9489] border-b border-[#E8E3DB] mb-10"
          aria-label="Breadcrumb"
        >
          <Link href={`/${locale}/blog`} className="hover:text-[#C8861A] transition-colors">
            {t.blogArticle.breadcrumb.articles}
          </Link>
          {article.blog_categories && (
            <>
              <span className="text-[#E8E3DB] text-sm">›</span>
              <Link
                href={`/${locale}/blog/category/${article.blog_categories.slug}`}
                className="hover:text-[#C8861A] transition-colors"
              >
                {article.blog_categories.name}
              </Link>
            </>
          )}
          <span className="text-[#E8E3DB] text-sm">›</span>
          <span className="text-[#6B7C6E] max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis">
            {article.title}
          </span>
        </nav>

<div className="max-w-5xl mx-auto my-8">
      <VerticalAdBanner position="center"/>
      </div>
        {/* Excerpt */}
        <blockquote className="font-serif text-[clamp(1rem,2.2vw,1.2rem)] font-normal text-[#6B7C6E] leading-[1.75] px-7 py-6 mb-10 border-l-[3px] border-[#C8861A] bg-[#C8861A]/[0.04] rounded-r-lg">
          {article.excerpt}
        </blockquote>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10">
          <span className="flex-1 h-px bg-[#E8E3DB]" />
          <span className="text-[#C8861A] text-xs tracking-[0.2em]">✦ ✦ ✦</span>
          <span className="flex-1 h-px bg-[#E8E3DB]" />
        </div>

        {/* Content */}
        <div className="text-[clamp(0.9rem,1.8vw,1rem)] leading-[1.85] p-0 text-[#2C2C2C] whitespace-pre-wrap bg-white border border-[#E8E3DB] rounded-xl px-[clamp(1.5rem,4vw,3rem)] py-10 shadow-sm mb-10">
          <div
  className="p-[0!important] border-0 shadow-[none!important] prose prose-stone max-w-none
             prose-headings:font-serif prose-headings:text-[#0F0F0F] prose-headings:tracking-tight
             prose-p:text-[#2C2C2C] prose-p:leading-[1.85]
             prose-a:text-[#C8861A] prose-a:no-underline hover:prose-a:underline
             prose-blockquote:border-l-[#C8861A] prose-blockquote:text-[#6B7C6E] prose-blockquote:bg-[#C8861A]/[0.04] prose-blockquote:rounded-r-lg
     prose-pre:bg-[#0d1117] prose-pre:text-[#e6edf3] prose-pre:rounded-none prose-pre:px-5 prose-pre:py-2 prose-pre:overflow-x-auto prose-pre:leading-relaxed prose-pre:text-sm prose-pre:my-0 prose-pre:border-0 prose-pre:shadow-none
prose-code:bg-[#F4F1EC] prose-code:text-[#C8861A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
             prose-hr:border-[#E8E3DB]
             prose-strong:text-[#0F0F0F]
             bg-white border border-[#E8E3DB] rounded-xl px-[clamp(1.5rem,4vw,3rem)] py-10 shadow-sm mb-10"
 dangerouslySetInnerHTML={{ __html: sanitizeContent(article.content) }}
/>
        </div>
        <div className="max-w-5xl mx-auto my-8">
      <VerticalAdBanner position="center"/>
      </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="bg-white border border-[#E8E3DB] rounded-xl px-8 py-6 shadow-sm">
            <div className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.09em] uppercase text-[#9A9489] mb-4">
              <span>{t.blogArticle.tags.title}</span>
              <span className="flex-1 h-px bg-[#E8E3DB]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag!.id}
                  href={`/${locale}/blog/tag/${tag!.slug}`}
                  className="inline-block px-3.5 py-1.5 text-[0.75rem] font-medium text-[#6B7C6E] border border-[#E8E3DB] rounded-full bg-transparent hover:border-[#C8861A] hover:text-[#C8861A] hover:bg-[#C8861A]/[0.06] transition-all duration-150 tracking-[0.01em]"
                >
                  {tag!.name}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}