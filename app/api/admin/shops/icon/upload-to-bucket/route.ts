import { supabaseAdmin } from "@/lib/supabase/admin";


//upload icons to bucket and save the url to shop table
export async function POST(req: Request) {
  const formData = await req.formData();

  const files = formData.getAll("files") as File[];
  const shopId = formData.get("shopId") as string;

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabaseAdmin.storage
      .from("shop-images")
      .upload(`icons/${fileName}`, file);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const { data } = supabaseAdmin.storage
      .from("shop-images")
        .getPublicUrl(`icons/${fileName}`);
        
   await supabaseAdmin
  .from("shops")
  .update({
    shop_icon_url: data.publicUrl,
  })
  .eq("shop_id", shopId);
  }

  return Response.json({ success: true });
}