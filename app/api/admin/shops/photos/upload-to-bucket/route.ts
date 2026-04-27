import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const formData = await req.formData();

  const files = formData.getAll("files") as File[];
  const shopId = formData.get("shopId") as string;

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabaseAdmin.storage
      .from("shop-images")
      .upload(fileName, file);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const { data } = supabaseAdmin.storage
      .from("shop-images")
      .getPublicUrl(fileName);

    await supabaseAdmin.from("shop_photos").insert({
      shop_id: shopId,
      image_url: data.publicUrl,
    });
  }

  return Response.json({ success: true });
}