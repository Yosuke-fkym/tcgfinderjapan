import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/admin/cards
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "20");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin.from("cards").select("*", { count: "exact" });

  // Search across English name, Japanese name, and card number
  if (search && search.trim() !== "") {
    const s = search.trim();
    query = query.or(
       `card_name.ilike.%${s}%,card_number.ilike.%${s}%`
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return Response.json({
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
    error,
  });
}

// POST /api/admin/cards
export async function POST(req: Request) {
  try {
    const body = await req.json();
    

    const flags:string[] = [];
    
    if (body.vintage) flags.push("Vintage");
    if (body.psa) flags.push("PSA");
    if (body.box) flags.push("BOX");
    if (body.pokémon) flags.push("Pokémon");
    if (body.onepiece) flags.push("ONE PIECE");
    if (body.cashonly) flags.push("Cash only");
    if (body.dragonball) flags.push("DRAGON BALL");
    if (body.cardsaccepted) flags.push("Cards accepted");


    // ✅ Create card
   const { data: card, error: cardError } = await supabaseAdmin
  .from("cards")
  .insert({
    card_name: body.card_name,
    pack_name: body.pack_name,
    slug: body.slug,
    card_number: body.card_number,
    rarity: body.rarity,
    illustrator_name: body.illustrator_name,
    pack_code: body.pack_code,
    article_id: body.article_id,
    ebay_raw_url: body.ebay_raw_url,
    ebay_slab_url: body.ebay_slab_url,
    mercari_raw_url: body.mercari_raw_url,
    mercari_slab_url: body.mercari_slab_url,
  })
  .select()
  .single();

    if (cardError || !card) {
      return Response.json(
        { error: cardError?.message || "Card creation failed" },
        { status: 400 }
      );
    }

        // ✅ Insert flags
    if (flags.length) {
      const { data: flagRows } = await supabaseAdmin
        .from("product_flags")
        .select("id,name")
        .in("name", flags);

      const relations = flagRows?.map((flag: any) => ({
        card_id: card.id,
        product_flag_id: flag.id,
      }));

      if (relations?.length) {
        await supabaseAdmin.from("card_product_flags").insert(relations);
      }
    }

    return Response.json({ success: true, card }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/cards
export async function DELETE(req: Request) {
  const { card_id } = await req.json();

  await supabaseAdmin.from("cards").delete().eq("id", card_id);

  return Response.json({ success: true });
}