// app/api/admin/articles/route.ts
// GET supports: ?status= &category= &tag= &orderBy= &order=

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const status       = searchParams.get("status");
  const categorySlug = searchParams.get("category");
  const tagSlug      = searchParams.get("tag");
  const orderBy      = searchParams.get("orderBy") ?? "created_at";
  const ascending    = searchParams.get("order") === "asc";

  let query = supabaseAdmin
    .from("articles")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      thumbnail_url,
      published_at,
      status,
      category_id,
      blog_categories:category_id (
        id,
        name,
        slug
      ),
      article_tags (
        general_blog_tags:general_blog_tag_id (
          id,
          name,
          slug
        )
      )
    `)
    .order(orderBy, { ascending });

  if (status)   query = query.eq("status", status);

  // Category filter — PostgREST joined column filter
  if (categorySlug) query = query.eq("blog_categories.slug", categorySlug);

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  let result = data ?? [];

  // PostgREST returns all rows with null on non-matching joins — filter out
  if (categorySlug) {
    result = result.filter((a: any) => a.blog_categories !== null);
  }

  // Tag filter — done in JS since it's a many-to-many through article_tags
  if (tagSlug) {
    result = result.filter((a: any) =>
      a.article_tags?.some(
        (at: any) => at.general_blog_tags?.slug === tagSlug
      )
    );
  }

  return Response.json({ data: result });
}

// POST /api/admin/articles
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      content,
      thumbnail_url,
      category_id,
      status,
      tag_ids,
    }: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      thumbnail_url?: string | null;
      category_id: string;
      status: "draft" | "published";
      tag_ids?: string[];
    } = body;

    const { data: article, error: articleError } = await supabaseAdmin
      .from("articles")
      .insert({
        title,
        slug,
        excerpt,
        content,
        thumbnail_url: thumbnail_url || null,
        category_id,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (articleError || !article) {
      return Response.json(
        { error: articleError?.message || "Article creation failed" },
        { status: 400 }
      );
    }

    if (tag_ids && tag_ids.length > 0) {
      const { error: tagError } = await supabaseAdmin
        .from("article_tags")
        .insert(tag_ids.map((tag_id) => ({ article_id: article.id, general_blog_tag_id: tag_id })));

      if (tagError) {
        console.error("Failed to insert article_tags:", tagError.message);
      }
    }

    return Response.json({ success: true, article }, { status: 200 });
  } catch (err) {
    console.error("POST /api/admin/articles error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}