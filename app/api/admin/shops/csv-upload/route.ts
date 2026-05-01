import { supabaseAdmin } from "@/lib/supabase/admin";

function parseBusinessHours(row: any) {
  const parseDay = (open: string, close: string) => {
    if (!open || open === "--:--") {
      return { closed: true };
    }
    return {
      open,
      close,
      closed: false,
    };
  };

  return {
    月曜日: parseDay(row.monday_open, row.monday_close),
    火曜日: parseDay(row.tuesday_open, row.tuesday_close),
    水曜日: parseDay(row.wednesday_open, row.wednesday_close),
    木曜日: parseDay(row.thursday_open, row.thursday_close),
    金曜日: parseDay(row.friday_open, row.friday_close),
    土曜日: parseDay(row.saturday_open, row.saturday_close),
    日曜日: parseDay(row.sunday_open, row.sunday_close),
  };
}

function parseHoliday(row: any) {
  if (row["holiday_open"] && row["holiday_close"]) {
    return {
      open: row["holiday_open"],
      close: row["holiday_close"],
    };
  }
  return null;
}

// 🔥 NEW: reels parser
function parseReels(row: any) {
  if (!row.reels) return [];

  return row.reels
    .split("|")
    .map((url: string) => url.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const rows = await req.json();

  for (const r of rows) {
    const body = {
      shop_name: r.shop_name,
      shop_address: r.shop_address,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
      website: r.website,
      language_support: r.language_support,
      description: r.description,
      x_account_url: r.x_account_url,
      business_hours: parseBusinessHours(r),
      holiday_hours: parseHoliday(r),
    };

    // 🟢 insert shop
    const { data: shop, error } = await supabaseAdmin
      .from("shops")
      .insert(body)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // 🟣 insert reels into shopVideos
    const videos = parseReels(r);

    if (videos.length) {
      const videoRows = videos.map((url: string) => ({
        shopId: shop.shop_id,
        videoUrl: url,
        platform: "Instagram",
      }));

      const { error: videoError } = await supabaseAdmin
        .from("shopVideos")
        .insert(videoRows);

      if (videoError) {
        return Response.json(
          { error: videoError.message },
          { status: 500 }
        );
      }
    }
  }

  return Response.json({ success: true });
}