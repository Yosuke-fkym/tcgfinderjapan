import { supabaseAdmin } from "@/lib/supabase/admin";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const scoreMap = new Map<string, number>();

  // Get Card
  const { data: card, error } = await supabaseAdmin
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !card) {
    return Response.json(
      {
        error: "Card not found",
      },
      {
        status: 404,
      },
    );
  }

  // Product Flags
  const { data: cardFlags } = await supabaseAdmin
    .from("card_product_flags")
    .select(
      `
      product_flag:product_flags(
        id,
        name
      )
    `,
    )
    .eq("card_id", card.id);

  if (!cardFlags) {
    return Response.json(
      {
        error: "Card flags not found",
      },
      {
        status: 404,
      },
    );
  }
  const flagArray = cardFlags.map((flag) => flag.product_flag);
const flagIds = flagArray.map((flag: any) => flag.id);
  const { data: shopFlagRelations } = await supabaseAdmin
    .from("shop_product_flags")
    .select("shop_id, flag_id")
    .in("flag_id", flagIds);

  if (!shopFlagRelations) {
    return Response.json(
      {
        error: "Shop flag relations not found",
      },
      {
        status: 404,
      },
    );
  }
  for (const row of shopFlagRelations) {
    const score = scoreMap.get(row.shop_id) ?? 0;

    scoreMap.set(row.shop_id, score + 1);
  }

  const shopIds = [...scoreMap.keys()];
  const { data: shops } = await supabaseAdmin
    .from("shops")
    .select(
      `
shop_id,
shop_name,
shop_name_in_langs,
shop_address,
shop_address_in_langs,
shop_icon_url,
latitude,
longitude
`,
    )
    .in("shop_id", shopIds);

  if (!shops) {
    return Response.json(
      {
        error: "Shop flag relations not found",
      },
      {
        status: 404,
      },
    );
  }

  const relatedShops = shops.map((shop) => ({
    ...shop,
    matchScore: scoreMap.get(shop.shop_id) ?? 0,
  }));

  relatedShops.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  const topShops = relatedShops.slice(0, 6);

  // Related Blog
  let article = null;

  if (card.article_id) {
    const { data } = await supabaseAdmin
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        thumbnail_url,
        excerpt
      `,
      )
      .eq("id", card.article_id)
      .single();

    article = data;
  }

  return Response.json({
    card,
    productFlags: cardFlags?.map((item: any) => item.product_flag) ?? [],
    article,
    relatedShops: topShops,
  });
}
