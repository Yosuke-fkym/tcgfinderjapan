import { createAuthClient } from "@/lib/supabase/serverAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = await createAuthClient();

    // ✅ GET query params
    const { searchParams } = new URL(req.url);
    const area = searchParams.get("area"); // e.g. 秋葉原
    const tag = searchParams.get("tag");   // e.g. Vintage

    // 🔥 1. Fetch reviews
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("shop_id, rating, selection_rating, price_rating")
      .eq("is_flagged", false);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 🔥 2. Build shop map (UNCHANGED LOGIC)
    const shopMap: Record<
      string,
      {
        selectionTotal: number;
        priceTotal: number;
        count: number;
      }
    > = {};

    reviews.forEach((review) => {
      const hasNewRatings =
        review.selection_rating !== null &&
        review.price_rating !== null;

      const selection = hasNewRatings
        ? review.selection_rating
        : review.rating ?? 0;

      const price = hasNewRatings
        ? review.price_rating
        : review.rating ?? 0;

      if (!shopMap[review.shop_id]) {
        shopMap[review.shop_id] = {
          selectionTotal: 0,
          priceTotal: 0,
          count: 0,
        };
      }

      shopMap[review.shop_id].selectionTotal += selection;
      shopMap[review.shop_id].priceTotal += price;
      shopMap[review.shop_id].count += 1;
    });

    // 🔥 3. Ranking calc (UNCHANGED)
    let ranking = Object.entries(shopMap).map(
      ([shop_id, value]) => {
        const avgSelection = value.selectionTotal / value.count;
        const avgPrice = value.priceTotal / value.count;
        const overall = (avgSelection + avgPrice) / 2;

        const score = overall * Math.log(value.count + 1);

        return {
          shopId: shop_id,
          avg: overall,
          avg_selection: avgSelection,
          avg_price: avgPrice,
          count: value.count,
          score,
        };
      }
    );

    // 🔥 4. sort
    ranking.sort((a, b) => b.score - a.score);

    // 🔥 5. fetch shops + flags (IMPORTANT)
    const { data: shops, error: shopError } = await supabase
      .from("shops")
      .select(`
        *,
        shop_product_flags(
          product_flags(name)
        )
      `);

    if (shopError) {
      return NextResponse.json(
        { error: shopError.message },
        { status: 500 }
      );
    }

    // 🔥 6. attach shop data
    let final = ranking
      .map((r) => {
        const shop = shops.find(
          (s) => s.shop_id === r.shopId
        );

        return {
          ...r,
          shop,
        };
      })
      .filter((r) => r.shop);

    // =============================
    // 🔥 7. APPLY FILTERS (NEW)
    // =============================

    // ✅ AREA FILTER
   if (area && area !== "ALL") {
  final = final.filter((item) => {
    const address = item.shop.shop_address || "";
    const name = item.shop.shop_name || "";

    // 秋葉原
    if (area === "秋葉原") {
      return address.includes("秋葉原") || name.includes("秋葉原");
    }

    // 池袋
    if (area === "池袋") {
      return address.includes("池袋");
    }

    // 東京全体 (client requirement)
    if (area === "東京") {
      return (
        address.includes("東京") ||
        address.includes("池袋") ||
        name.includes("秋葉原")
      );
    }

    // prefectures (大阪府, 愛知県, etc.)
    return address.includes(area);
  });
}
    // ✅ TAG FILTER
    if (tag && tag !== "ALL") {
      final = final.filter((item) =>
        item.shop.shop_product_flags?.some(
          (f: any) => f.product_flags.name === tag
        )
      );
    }

    return NextResponse.json(final);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}