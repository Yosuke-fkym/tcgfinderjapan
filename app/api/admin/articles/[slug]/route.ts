// app/api/articles/[slug]/route.ts
// Public GET — fetches a single published article by slug.
// Returns is_protected flag so the detail page can decide to gate.
// NEVER exposes password_hash to the client.

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return Response.json({ error: "Slug is required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
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
      is_protected,
      password_hash
      blog_categories:category_id (
        id,
        name,
        slug
      ),
      article_tags (
        general_blog_tags (
          id,
          name,
          slug
        )
      )
    `)
    // password_hash intentionally excluded
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return Response.json({ error: "Article not found." }, { status: 404 });
  }

  return Response.json({ data });
}