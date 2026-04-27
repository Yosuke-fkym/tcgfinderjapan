import { supabaseAdmin } from "@/lib/supabase/admin";

function parseBusinessHours(row: any) {
  return {
    月曜日: row["月曜日_closed"] === "true"
      ? { closed: true }
      : { open: row["月曜日_open"], close: row["月曜日_close"] },

    火曜日: row["火曜日_closed"] === "true"
      ? { closed: true }
      : { open: row["火曜日_open"], close: row["火曜日_close"] },

    水曜日: row["水曜日_closed"] === "true"
      ? { closed: true }
      : { open: row["水曜日_open"], close: row["水曜日_close"] },

    木曜日: row["木曜日_closed"] === "true"
      ? { closed: true }
      : { open: row["木曜日_open"], close: row["木曜日_close"] },

    金曜日: row["金曜日_closed"] === "true"
      ? { closed: true }
      : { open: row["金曜日_open"], close: row["金曜日_close"] },

    土曜日: row["土曜日_closed"] === "true"
      ? { closed: true }
      : { open: row["土曜日_open"], close: row["土曜日_close"] },

    日曜日: row["日曜日_closed"] === "true"
      ? { closed: true }
      : { open: row["日曜日_open"], close: row["日曜日_close"] },
  };
}

function parseHoliday(row: any) {
  if (row["祝日_open"] && row["祝日_close"]) {
    return {
      open: row["祝日_open"],
      close: row["祝日_close"],
    };
  }
  return null;
}

export async function POST(req: Request) {
  const rows = await req.json();

  const formatted = rows.map((r: any) => ({
    shop_name: r.shop_name,
    shop_address: r.shop_address,
    latitude: parseFloat(r.latitude),
    longitude: parseFloat(r.longitude),
    website: r.website,
    language_support: r.language_support,
    description: r.description,

    business_hours: parseBusinessHours(r),
    holiday_hours: parseHoliday(r),
  }));

  const { error } = await supabaseAdmin.from("shops").insert(formatted);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}