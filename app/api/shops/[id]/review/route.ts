import { createAuthClient } from "@/lib/supabase/serverAuth";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET → fetch reviews for a shop
export async function GET(
  req: NextRequest,
  { params }: { params: any }
) {
  const supabase = await createAuthClient();
  const { id: shopId } = await params;
  

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      user:users(id, name, email),
      review_likes(user_id)
    `)
    .eq("shop_id", shopId)
    .order("posted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ✅ add overall rating
  const formatted = data.map((r) => {
    const selection = r.selection_rating ?? r.rating ?? 0;
    const price = r.price_rating ?? r.rating ?? 0;

    return {
      ...r,
      overall_rating: (selection + price) / 2,
    };
  });

  return NextResponse.json(formatted);
}

// ✅ POST → add OR update review
export async function POST(
  req: NextRequest,
  { params }: { params: any }
) {
  const supabase = await createAuthClient();
  const { id: shopId } = await params;
  

  const body = await req.json();
  const { rating, comment, photo_url, selection_rating, price_rating } = body;
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("reviews")
    .select(`*`)
    .eq("shop_id", shopId)
    .eq("user_id", user.id)
    .single();

  // ✅ fallback for old rating
  const finalSelection = selection_rating ?? rating;
  const finalPrice = price_rating ?? rating;

  let result;

  if (existing) {
    result = await supabase
      .from("reviews")
      .update({
        comment,
        photo_url,
        rating,
        selection_rating: finalSelection,
        price_rating: finalPrice,
      })
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("reviews")
      .insert({
        shop_id: shopId,
        user_id: user.id,
        photo_url,
        rating,
        comment,
        selection_rating: finalSelection,
        price_rating: finalPrice,
      })
      .select()
      .single();

      
  }

  if (result.error) {
    
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ review: result.data });
}

// ✅ DELETE → delete review
export async function DELETE(
  req: NextRequest,
  { params }: { params: any }
) {
  const supabase = await createAuthClient();
  const { id:shopId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("shop_id", shopId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}