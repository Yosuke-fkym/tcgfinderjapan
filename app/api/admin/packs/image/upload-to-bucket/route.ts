import { supabaseAdmin } from "@/lib/supabase/admin";

// upload a single pack image to the bucket and save the url onto cards.card_image
export async function POST(req: Request) {
  const formData = await req.formData();

  const files = formData.getAll("files") as File[];
  const packId = formData.get("packId") as string;

  // Card only ever has one image, so just take the first file.
  const file = files[0];

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("card_images")
    .upload(`packs/${fileName}`, file);

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 400 });
  }

  const { data } = supabaseAdmin.storage
    .from("card_images")
    .getPublicUrl(`packs/${fileName}`);

  const { error: updateError } = await supabaseAdmin
    .from("packs")
    .update({ image_url: data.publicUrl })
    .eq("id", packId);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 });
  }

  return Response.json({ success: true, url: data.publicUrl });
}