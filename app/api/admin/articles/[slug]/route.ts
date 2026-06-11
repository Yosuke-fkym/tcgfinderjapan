// app/api/articles/[slug]/route.ts
// Public GET only — fetches a single published article by slug.
// PATCH and DELETE live in /api/admin/articles/[id]/route.ts (admin, by id).

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request, { params }: any) {
  const { slug } = await params;
console.log("api: " + slug);

  if (!slug) {
    return Response.json({ error: "Slug is required" }, { status: 400 });
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
    .eq("slug", slug)
    .eq("status", "published")
    .single();
    

  if (error || !data) {
    return Response.json({ error: "Article not found" }, { status: 404 });
  }

  return Response.json({ data });
}