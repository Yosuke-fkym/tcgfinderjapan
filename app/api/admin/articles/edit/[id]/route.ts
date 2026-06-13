// app/api/admin/articles/id/[id]/route.ts
// GET by id (admin edit page load)
// PATCH — now handles is_protected, password changes, and clear_password
// DELETE by id

import { supabaseAdmin } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";

// GET /api/admin/articles/id/[id]
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return Response.json({ error: "Article id is required." }, { status: 400 });
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
        is_featured,
        is_protected,
        category_id,
        blog_categories:category_id (
          id,
          name,
          slug
        ),
        article_tags (
          general_blog_tag_id
        )
      `)
      // Intentionally exclude password_hash — admin UI never needs it
      .eq("id", id)
      .single();

    if (error || !data) {
      return Response.json({ error: "Article not found." }, { status: 404 });
    }

    return Response.json({ data });
  } catch (err) {
    console.error("GET /api/admin/articles/id/[id] error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}

// PATCH /api/admin/articles/id/[id]
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return Response.json({ error: "Article id is required." }, { status: 400 });
    }

    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      content,
      thumbnail_url,
      is_featured,
      category_id,
      status,
      published_at,
      tag_ids,
      is_protected,
      password_hash,       // present only when admin explicitly sets / changes password
      clear_password, // true when admin disables protection
    } = body;

    // ── Resolve password_hash update ─────────────────────────────────────────

    let passwordUpdate: { password_hash: string | null } | undefined;

    if (clear_password === true || is_protected === false) {
      // Admin disabled protection — wipe the hash
      passwordUpdate = { password_hash: null };
    } else if (is_protected === true && password_hash?.trim()) {
      // Admin set / changed the password — hash it
      const hashed = await bcrypt.hash(password_hash.trim(), 12);
      passwordUpdate = { password_hash: hashed };
    }
    // else: protection unchanged, no new password provided — leave hash alone

    // ── Update article ────────────────────────────────────────────────────────

    const { error: updateError } = await supabaseAdmin
      .from("articles")
      .update({
        ...(title         !== undefined && { title }),
        ...(slug          !== undefined && { slug }),
        ...(excerpt       !== undefined && { excerpt }),
        ...(content       !== undefined && { content }),
        ...(thumbnail_url !== undefined && { thumbnail_url }),
        ...(category_id   !== undefined && { category_id }),
        ...(status        !== undefined && { status }),
        ...(is_protected  !== undefined && { is_protected }),
        ...(is_featured   !== undefined && {is_featured}),
        ...(status === "published" && {
          published_at: published_at ?? new Date().toISOString(),
        }),
        ...(status === "draft" && { published_at: null }),
        ...passwordUpdate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 400 });
    }

    // ── Replace article_tags ──────────────────────────────────────────────────

    if (tag_ids !== undefined) {
      await supabaseAdmin.from("article_tags").delete().eq("article_id", id);

      if (tag_ids.length > 0) {
        const { error: tagError } = await supabaseAdmin
          .from("article_tags")
          .insert(
            tag_ids.map((tag_id: string) => ({
              article_id: id,
              general_blog_tag_id: tag_id,
            }))
          );
        if (tagError) console.error("Failed to replace article_tags:", tagError.message);
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/articles/id/[id] error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}

// DELETE /api/admin/articles/id/[id]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return Response.json({ error: "Article id is required." }, { status: 400 });
    }

    await supabaseAdmin.from("article_tags").delete().eq("article_id", id);

    const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/articles/id/[id] error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}