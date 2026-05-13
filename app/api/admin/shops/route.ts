import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/admin/shops
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("shops")
    .select(`
      *,
      reviews(count)
    `)
    .order("created_at", { ascending: false });

  // 🔥 flatten count
  const formatted = data?.map((shop: any) => ({
    ...shop,
    // reviews_count: shop.reviews?.[0]?.count || 0,
  }));

  return Response.json({ data: formatted, error });
}

// POST /api/admin/shops
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const flags: string[] = [];
    const videos: string[] = body.videos || [];

    if (body.vintage) flags.push("Vintage");
    if (body.psa) flags.push("PSA");
    if (body.box) flags.push("BOX");
    if (body.pokémon) flags.push("Pokémon");
    if (body.onepiece) flags.push("ONE PIECE");

    // console.log("body: ", body.area);
    
    // ✅ 1. Create shop
    const { data: shop, error: shopError } = await supabaseAdmin
      .from("shops")
      .insert({
        shop_name: body.shop_name,
        shop_address: body.shop_address,
        latitude: body.latitude,
        longitude: body.longitude,
        // language_support: body.language_support,
        description: body.description,
        website: body.website,
        business_hours: body.business_hours,
        holiday_hours: body.holiday_hours,
        area: body.area,
      })
      .select()
      .single();

    if (shopError || !shop) {
      return Response.json(
        { error: shopError?.message || "Shop creation failed" },
        { status: 400 }
      );
    }

    // ✅ 2. Insert videos
    if (videos.length) {
      const videoRows = videos
        .filter((url) => url.trim() !== "")
        .map((url) => ({
          shopId: shop.shop_id,
          videoUrl: url,
          platform: "Instagram",
        }));

      if (videoRows.length) {
        await supabaseAdmin.from("shopVideos").insert(videoRows);
      }
    }

    // ✅ 3. Insert flags
    if (flags.length) {
      const { data: flagRows } = await supabaseAdmin
        .from("product_flags")
        .select("id,name")
        .in("name", flags);

      const relations = flagRows?.map((flag: any) => ({
        shop_id: shop.shop_id,
        flag_id: flag.id,
      }));

      if (relations?.length) {
        await supabaseAdmin.from("shop_product_flags").insert(relations);
      }
    }

    return Response.json({ success: true, shop }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/admin/shops
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { shop_id, videos } = body;

    // ✅ 1. Update shop
    const { error: updateError } = await supabaseAdmin
      .from("shops")
      .update({
        shop_name: body.shop_name,
        shop_address: body.shop_address,
        latitude: body.latitude,
        longitude: body.longitude,
        // language_support: body.language_support,
        description: body.description,
        website: body.website,
        business_hours: body.business_hours,
        holiday_hours: body.holiday_hours,
        area: body.area,
      })
      .eq("shop_id", shop_id);

    if (updateError) {
      return Response.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    // ✅ 2. Replace videos (delete + insert)
    if (videos) {
      await supabaseAdmin
        .from("shopVideos")
        .delete()
        .eq("shopId", shop_id);

      const videoRows = videos
        .filter((url: string) => url.trim() !== "")
        .map((url: string) => ({
          shopId: shop_id,
          videoUrl: url,
          platform: "Instagram",
        }));

      if (videoRows.length) {
        await supabaseAdmin.from("shopVideos").insert(videoRows);
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/shops
export async function DELETE(req: Request) {
  // const supabase = await createAuthClient();
  const { shop_id } = await req.json();

  await supabaseAdmin.from("shops").delete().eq("shop_id", shop_id);

  return Response.json({ success: true });
}