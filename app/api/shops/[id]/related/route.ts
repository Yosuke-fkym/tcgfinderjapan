import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;

  // 1. current shop fetch karo
  const { data: shop } = await supabaseAdmin
    .from("shops")
    .select("shop_id, shop_address")
    .eq("shop_id", id)
    .single();
    
    
    if (!shop) {
        return Response.json({ data: [] });
    }
    
    // 2. simple area extraction (optional improve later)
    const area = shop.shop_address?.split(",")[0];
    
    // 3. related shops fetch
  const { data, error } = await supabaseAdmin
    .from("shops")
    .select("*, shop_photos(image_url)")
    .neq("shop_id", id)
    .ilike("shop_address", `%${area}%`)
    .limit(4);

    const transformedData = (data || []).map((shop) => ({
        ...shop,
        images: shop.shop_photos?.map((p: any) => p.image_url) || []
    }));
    
  return Response.json({ data: transformedData, error });
}