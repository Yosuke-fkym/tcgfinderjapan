// app/api/blog/categories/[slug]/route.ts
// Public GET — fetch a single category by slug.

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  req: Request,
) {
  try {

    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .select("id, name, slug")

    if (error || !data) {
      return Response.json({ error: "Categories not found" }, { status: 404 });
    }

    return Response.json({ data });
  } catch (err) {
    console.error("GET /api/blog/categories error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}