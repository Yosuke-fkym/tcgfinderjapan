import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Short fingerprint of the hash — never exposes the hash itself
function makeFingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();
    const { password } = body;

    if (!slug || !password) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { data: article, error } = await supabaseAdmin
      .from("articles")
      .select("id, slug, is_protected, password_hash")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !article) {
      return Response.json({ error: "Article not found." }, { status: 404 });
    }

    if (!article.is_protected || !article.password_hash) {
      return Response.json({ error: "This article is not protected." }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, article.password_hash);

    if (!valid) {
      return Response.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    // ✅ Cookie value now includes a fingerprint of the current password_hash.
    // When admin changes the password → hash changes → fingerprint changes
    // → this cookie value no longer matches → user must re-authenticate.
    const fingerprint  = makeFingerprint(article.password_hash);
    const cookieName   = `tcg_article_${slug}`;
    const cookieValue  = `granted:${slug}:${fingerprint}`;

    const isProd = process.env.NODE_ENV === "production";

    const cookieHeader = [
      `${cookieName}=${cookieValue}`,
      `Max-Age=${COOKIE_MAX_AGE}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      ...(isProd ? ["Secure"] : []),
    ].join("; ");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (err) {
    console.error("POST /api/articles/[slug]/verify error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}