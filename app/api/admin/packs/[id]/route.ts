import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/admin/packs/[id]
export async function GET(
  req: Request,
  { params }: any
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("packs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return Response.json({
    data,
    error,
  });
}

// PATCH /api/admin/packs/[id]
export async function PATCH(
  req: Request,
  { params }: any
) {
  const body = await req.json();
  const { id } = await params;

  const removeImage = body.removeImage;

  delete body.removeImage;
  delete body.pack_id;

  const { data: pack, error } = await supabaseAdmin
    .from("packs")
    .update({
      ...body,
      ...(removeImage && {
        image_url: null,
      }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({
      error,
    });
  }

  return Response.json({
    success: true,
    pack,
  });
}