import { supabaseAdmin } from "@/lib/supabase/admin";

function generateSlug(cardName?: string, cardNumber?: string) {
  const base = `${cardName ?? ""}-${cardNumber ?? ""}`
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
      card_name: r.card_name,
      pack_name: r.pack_name,
      card_number: r.card_number,
      illustrator_name: r.illustrator_name,
      slug: r.slug?.trim() || generateSlug(r.card_name, r.card_number),
      ebay_raw_url: r.ebay_raw_url || null,
      ebay_slab_url: r.ebay_slab_url || null,
      mercari_raw_url: r.mercari_raw_url || null,
      mercari_slab_url: r.mercari_slab_url || null,
    };

    const { error } = await supabaseAdmin.from("cards").insert(body);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ success: true });
}