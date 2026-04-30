import { createAuthClient } from "@/lib/supabase/serverAuth";

// POST history
export async function POST(req: Request) {
  const supabase = await createAuthClient();

  const { shop_id } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }


  const {error } = await supabase.from("viewed_history").upsert({
    user_id: user.id,
    shop_id,
    viewed_at: new Date().toISOString(),
},
{ onConflict: "user_id,shop_id" }
);

console.log(error);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}

// GET history
export async function GET() {
  const supabase = await createAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ data: [] });
  }

  const { data } = await supabase
    .from("viewed_history")
    .select(`
      id,
      shop_id,
      viewed_at,
      shops (
        shop_id,
        shop_name,
        shop_address,
        shop_photos ( image_url ),
        shop_name_in_langs,
        shop_desc_in_langs,
        shop_address_in_langs
      )
    `)
    .eq("user_id", user.id)
    .order("viewed_at", { ascending: false })
    .limit(20);

  return Response.json({ data });
}