import { createAuthClient } from "@/lib/supabase/serverAuth";

// GET /api/favorites - Get user's favorite shops
export async function GET(req: Request) {
  const supabase = await createAuthClient();
  const allFlag = new URL(req.url).searchParams.get("all") === "true";

  const {
    data: { user },
  } = await supabase.auth.getUser(); // ✅ DIRECT

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(allFlag ? `shops(
        shop_id,
        shop_name,
        shop_address,
        description,
        shop_photos (
          image_url
          )
          shop_name_in_langs,
          shop_desc_in_langs
      )` : "shop_id")
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ data });
}


// POST /api/favorites - Add a shop to favorites
export async function POST(req: Request) {
  const supabase = await createAuthClient();

  const { shop_id } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser(); // ✅ DIRECT

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    shop_id,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ success: true });
}


// DELETE /api/favorites - Remove a shop from favorites
export async function DELETE(req: Request) {
  const supabase = await createAuthClient();
  const { shop_id } = await req.json();

const {
  data: { user },
} = await supabase.auth.getUser(); // ✅ DIRECT

if (!user) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("shop_id", shop_id);

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ success: true });
}
