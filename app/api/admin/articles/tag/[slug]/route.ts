// app/api/blog/tags/[slug]/route.ts
// Public GET — fetch a single tag by slug.

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
      .from("general_blog_tags")
      .select("id, name, slug")
      .eq("slug", slug)
      .maybeSingle();
console.log(slug);

    if (error || !data) {
      return Response.json({ error: "Tag not found" }, { status: 404 });
    }

    return Response.json({ data });
  } catch (err) {
    console.error("GET /api/blog/tags/[slug] error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}