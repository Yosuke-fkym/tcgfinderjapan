
import { transformShop } from "@/lib/helpers/transformShop";
import { createAuthClient } from "@/lib/supabase/serverAuth";

export async function GET(
  req: Request,
  { params }: { params: any }
) {
    const {id} = await params;
    const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from("shops")
    .select(`*, shop_product_flags(product_flags(name)), shop_photos(image_url), shopVideos(id, videoUrl)`)
    .eq("shop_id", id)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({
    data: transformShop(data),
  });
}