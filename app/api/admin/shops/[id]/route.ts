import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/admin/shops/[id] - Get a shop by ID
export async function GET(req: Request, { params }: any) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("shops")
    .select(`*,shop_product_flags(product_flags(id, name)),shop_photos(id, image_url), shopVideos(id, videoUrl)`)
    .eq("shop_id", id)
    .maybeSingle();

  return Response.json({ data, error });
}

// PATCH /api/admin/shops/[id] - Update a shop by ID
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

  const uniqueFlags = [...new Set(flags)];

  // -------- extract videos --------
  const videos: string[] = body.videos || [];
  const removeIcon = body.removeIcon;
  
  // remove flags + videos from shop body
  delete body.vintage;
  delete body.psa;
  delete body.box;
  delete body.pokémon;
  delete body.onepiece;
  delete body.videos;
  delete body.removeIcon;

  
  // -------- update shop --------
  const { data: shop, error } = await supabaseAdmin
    .from("shops")
    .update({
    ...body,
    ...(removeIcon && {
      shop_icon_url: null,
    }),
  })
    .eq("shop_id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error });
  }

  // -------- update flags --------
  await supabaseAdmin.from("shop_product_flags").delete().eq("shop_id", id);

  if (uniqueFlags.length) {
    const { data: flagRows } = await supabaseAdmin
      .from("product_flags")
      .select("id, name")
      .in("name", uniqueFlags);

    const relations = flagRows?.map((flag: any) => ({
      shop_id: id,
      flag_id: flag.id,
    }));

    if (relations?.length) {
      await supabaseAdmin.from("shop_product_flags").insert(relations);
    }
  }

  // -------- 🎥 update videos (IMPORTANT) --------
  // 1. delete old
  await supabaseAdmin.from("shopVideos").delete().eq("shopId", id);

  // 2. insert new
  const videoRows = videos
    .filter((url) => url.trim() !== "")
    .map((url) => ({
      shopId: id,
      videoUrl: url,
      platform: "Instagram",
    }));

  if (videoRows.length) {
    await supabaseAdmin.from("shopVideos").insert(videoRows);
  }

  return Response.json({
    success: true,
    shop,
  });
}