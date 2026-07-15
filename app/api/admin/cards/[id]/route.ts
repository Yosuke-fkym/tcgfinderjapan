import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/admin/cards/[id] - Get a card by ID
export async function GET(req: Request, { params }: any) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("cards")
    .select(`*, card_product_flags(product_flags(id, name))`)
    .eq("id", id)
    .maybeSingle();

  return Response.json({ data, error });
}

// PATCH /api/admin/cards/[id] - Update a card by ID
export async function PATCH(req: Request, { params }: any) {
  const body = await req.json();
  const { id } = await params;

    // -------- detect flags --------
  const flags = [];

  if (body.vintage) flags.push("Vintage");
  if (body.psa) flags.push("PSA");
  if (body.box) flags.push("BOX");
  if (body.pokémon) flags.push("Pokémon");
  if (body.onepiece) flags.push("ONE PIECE");
  if (body.cashonly) flags.push("Cash only");
    if (body.dragonball) flags.push("DRAGON BALL");
    if (body.cardsaccepted) flags.push("Cards accepted");

  const uniqueFlags = [...new Set(flags)];

  const removeImage = body.removeImage;

  // remove non-column fields from the update body
  delete body.removeImage;
  delete body.card_id;

  // remove flags from shop body
  delete body.vintage;
  delete body.psa;
  delete body.box;
  delete body.pokémon;
  delete body.onepiece;
  delete body.cashonly;
  delete body.dragonball;
  delete body.cardsaccepted;
  delete body.videos;
  delete body.removeIcon;

  // -------- update card --------
  const { data: card, error } = await supabaseAdmin
    .from("cards")
    .update({
      ...body,
      ...(removeImage && {
        card_image: null,
      }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error });
  }

  // -------- update flags --------
  await supabaseAdmin.from("card_product_flags").delete().eq("id", id);

  if (uniqueFlags.length) {
    const { data: flagRows } = await supabaseAdmin
      .from("product_flags")
      .select("id, name")
      .in("name", uniqueFlags);

    const relations = flagRows?.map((flag: any) => ({
      card_id: id,
      product_flag_id: flag.id,
    }));

    if (relations?.length) {
      await supabaseAdmin.from("card_product_flags").insert(relations);
    }
  }

  return Response.json({
    success: true,
    card,
  });
}