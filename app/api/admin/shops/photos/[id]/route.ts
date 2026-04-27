import { supabaseAdmin } from "@/lib/supabase/admin";
// DELETE /api/admin/shops/photos/[id] - Delete a shop photo by ID
export async function DELETE(req: Request, { params }: any) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("shop_photos").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
