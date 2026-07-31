import { supabaseAdmin } from "@/lib/supabase/admin";

function generateSlug(nameEn?: string) {
  if (!nameEn) {
    return;
  }
  const base = nameEn
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return base || undefined;
}

export async function POST(req: Request) {
  const rows = await req.json();

  for (const r of rows) {
    const body = {
      slug: r.slug?.trim() || generateSlug(r.name_en),
      name_en: r.name_en,
      name_jp: r.name_jp || null,
      image_url: r.image_url || null,
      release_date: r.release_date || null,
      ebay_url: r.ebay_url || null,
      mercari_url: r.mercari_url || null,
    };

    const { error } = await supabaseAdmin.from("packs").insert(body);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ success: true });
}