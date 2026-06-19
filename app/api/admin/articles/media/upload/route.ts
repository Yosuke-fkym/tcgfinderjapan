// app/api/upload-image/route.js

import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";


const BUCKET = "article-images";           // Supabase bucket name
const FOLDER = "blogImages";            // Folder inside bucket
const MAX_SIZE = 5 * 1024 * 1024;       // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(request:Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    // ── Validation ──────────────────────────────────────────────────────────
    if (!file || typeof file === "string")
      return NextResponse.json({ error: "'image' field required hai." }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Sirf images allowed hain (jpg, png, webp, gif, svg)." }, { status: 415 });

    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "Image 5MB se chhoti honi chahiye." }, { status: 413 });

    // ── Unique filename ──────────────────────────────────────────────────────
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const storagePath = `${FOLDER}/${uniqueName}`;  // blogImages/1234-abcd.jpg

    // ── Buffer convert ───────────────────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());

    // ── Supabase Storage Upload ──────────────────────────────────────────────
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,        // same name se overwrite mat karo
        cacheControl: "3600", // 1 hour browser cache
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Storage upload failed: " + uploadError.message }, { status: 500 });
    }

    // ── Public URL banao ─────────────────────────────────────────────────────
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: storagePath,
      filename: uniqueName,
      size: file.size,
      type: file.type,
    });

  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: "Server error. Dobara try karo." }, { status: 500 });
  }
}