import { supabaseAdmin } from "@/lib/supabase/admin";

// POST /api/admin/shops/photos - Add a new shop photo
export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabaseAdmin.from("shop_photos").insert(body);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
