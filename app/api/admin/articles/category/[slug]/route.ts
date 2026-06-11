// app/api/blog/categories/[slug]/route.ts
// Public GET — fetch a single category by slug.

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return Response.json({ error: "Slug is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .select("id, name, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json({ data });
  } catch (err) {
    console.error("GET /api/blog/categories/[slug] error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}