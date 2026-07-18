import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Get pack
  const { data: pack, error: packError } = await supabaseAdmin
    .from("packs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (packError || !pack) {
    return Response.json(
      { error: "Pack not found" },
      { status: 404 }
    );
  }

  // Get cards belonging to this pack
  const { data: cards, error: cardsError } = await supabaseAdmin
    .from("cards")
    .select("*")
    .eq("pack_name", pack.name_en)
    .order("card_number", { ascending: true });

  if (cardsError) {
    return Response.json(
      { error: cardsError.message },
      { status: 500 }
    );
  }

  return Response.json({
    pack,
    cards,
  });
}