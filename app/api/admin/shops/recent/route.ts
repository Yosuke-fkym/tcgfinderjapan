import { isShopOpen } from "@/lib/helpers/getShopStatus";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createAuthClient } from "@/lib/supabase/serverAuth";

// GET /api/admin/shops/recent
export async function GET() {
  try {
    // 🔹 recent shops (with review count)
    const { data, error } = await supabaseAdmin
      .from("shops")
      .select(`
        *,
        reviews(count)
      `)
      .order("created_at", { ascending: false })
      .limit(5);

      
    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // 🔹 flatten review count
    const formatted = data?.map((shop: any) => ({
      ...shop
    }));

    // 🔹 total count
    const { count } = await supabaseAdmin
      .from("shops")
      .select("*", { count: "exact", head: true });

    // 🔹 all shops (for stats)
    const { data: allShops, error: allError } = await supabaseAdmin
      .from("shops")
      .select("*");

    if (allError) {
      return Response.json({ error: allError.message }, { status: 400 });
    }

    let opened = 0;
    let closed = 0;

    allShops?.forEach((shop) => {
      const isOpen = isShopOpen(shop);

      if (isOpen) opened++;
      else closed++;
    });

    return Response.json(
      {
        data: formatted, // ✅ use formatted
        count,
        stats: {
          opened,
          closed,
        }
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}