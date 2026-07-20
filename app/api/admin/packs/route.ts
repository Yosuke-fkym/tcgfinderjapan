import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/admin/packs
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "20");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin.from("packs").select("*", { count: "exact" });

  if (search && search.trim() !== "") {
    const s = search.trim();

    query = query.or(
      `name_en.ilike.%${s}%,name_jp.ilike.%${s}%`
    );
  }

  const { data, error, count } = await query
    .order("release_date", { ascending: false })
    .range(from, to);

  return Response.json({
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
    error,
  });
}

// POST /api/admin/packs
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data: pack, error } = await supabaseAdmin
      .from("packs")
      .insert({
        slug: body.slug,
        name_en: body.name_en,
        name_jp: body.name_jp,
        image_url: body.image_url,
        release_date: body.release_date,
        ebay_url: body.ebay_url,
        mercari_url: body.mercari_url
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        pack,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/packs
export async function DELETE(req: Request) {
  const { pack_id } = await req.json();

  await supabaseAdmin
    .from("packs")
    .delete()
    .eq("id", pack_id);

  return Response.json({
    success: true,
  });
}