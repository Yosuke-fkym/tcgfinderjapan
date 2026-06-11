import { supabaseAdmin } from "@/lib/supabase/admin";

// POST /api/admin/articles/thumbnail/upload
// Uploads a single thumbnail image to the "article-images" bucket
// and optionally updates the article's thumbnail_url if articleId is provided.
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const articleId = formData.get("articleId") as string | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // ✅ 1. Upload to bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from("article-images")
      .upload(fileName, file);

    if (uploadError) {
      return Response.json({ error: uploadError.message }, { status: 400 });
    }

    // ✅ 2. Get public URL
    const { data } = supabaseAdmin.storage
      .from("article-images")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    // ✅ 3. If articleId provided (edit mode), update thumbnail_url on the article
    if (articleId) {
      const { error: updateError } = await supabaseAdmin
        .from("articles")
        .update({ thumbnail_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", articleId);

      if (updateError) {
        return Response.json({ error: updateError.message }, { status: 400 });
      }
    }

    return Response.json({ success: true, url: publicUrl }, { status: 200 });
  } catch (err) {
    console.error("POST /api/admin/articles/thumbnail/upload error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}