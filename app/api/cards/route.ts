import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search")?.trim() ?? "";
  const rarity = searchParams.get("rarity") ?? "all";
  const pack = searchParams.get("pack") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "8");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("cards")
    .select("*", { count: "exact" });

  // Search
  if (search) {
    query = query.or(
      [
        `card_name.ilike.%${search}%`,
        `card_number.ilike.%${search}%`,
        `pack_name.ilike.%${search}%`,
        `illustrator_name.ilike.%${search}%`,
        `pack_code.ilike.%${search}%`,
      ].join(",")
    );
  }

  // Rarity
  if (rarity !== "all") {
    query = query.eq("rarity", rarity);
  }

  // Pack
  if (pack !== "all") {
    query = query.eq("pack_name", pack);
  }

  // Sorting
  switch (sort) {
    case "name-asc":
      query = query.order("card_name", {
        ascending: true,
      });
      break;

    case "name-desc":
      query = query.order("card_name", {
        ascending: false,
      });
      break;

    case "newest":
    default:
      query = query.order("created_at", {
        ascending: false,
      });
      break;
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  return Response.json({
    cards: data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  });
}