import { supabaseAdmin } from "@/lib/supabase/admin";
import { createAuthClient } from "@/lib/supabase/serverAuth";

export async function POST(req: Request) {
  const formData = await req.formData();

  const files = formData.getAll("files") as File[];
  const shopId = formData.get("shopId") as string;
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("review_images")
      .upload(fileName, file);

    if (uploadError) {
        console.log(uploadError);
      return Response.json({ error: uploadError.message }, { status: 400 });
    }
    

    const { data } = supabaseAdmin.storage
      .from("review_images")
      .getPublicUrl(fileName);

    if (!data?.publicUrl) {
      return Response.json(
        { error: "Could not get public URL" },
        { status: 400 }
      );
    }

    uploadedUrls.push(data.publicUrl);
  }

  return Response.json({ success: true, data: uploadedUrls });
}