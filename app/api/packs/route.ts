import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "12");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("packs")
    .select("*", { count: "exact" });

  if (search && search.trim()) {
    const s = search.trim();

    query = query.or(
      `name_en.ilike.%${s}%,name_jp.ilike.%${s}%`
    );
  }

  const { data, error, count } = await query
    .order("release_date", { ascending: false })
    .range(from, to);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    packs: data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  });
}