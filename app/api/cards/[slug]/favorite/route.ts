import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAuthClient } from "@/lib/supabase/serverAuth";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface Context {
  params: Promise<{
    slug: string;
  }>;
}

// GET -> Check favorite status
export async function GET(_: NextRequest, { params }: Context) {
    const supabase =  await createAuthClient();

    const {
    data: { user },
  } = await supabase.auth.getUser(); // ✅ DIRECT
  const { slug } = await params;

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: card } = await supabaseAdmin
    .from("cards")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!card) {
    return NextResponse.json(
      { error: "Card not found" },
      { status: 404 }
    );
  }

  const { data } = await supabaseAdmin
    .from("card_favourites")
    .select("id")
    .eq("user_id", user.id)
    .eq("card_id", card.id)
    .maybeSingle();

  return NextResponse.json({
    isFavorite: !!data,
  });
}

// POST -> Add favorite
export async function POST(_: NextRequest, { params }: Context) {
  const { slug } = await params;

  const supabase = await createAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: card } = await supabaseAdmin
    .from("cards")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!card) {
    return NextResponse.json(
      { error: "Card not found" },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from("card_favourites")
    .upsert(
      {
        user_id: user.id,
        card_id: card.id,
      },
      {
        onConflict: "user_id,card_id",
      }
    );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}

// DELETE -> Remove favorite
export async function DELETE(_: NextRequest, { params }: Context) {
  const { slug } = await params;

  const supabase = await createAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: card } = await supabaseAdmin
    .from("cards")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!card) {
    return NextResponse.json(
      { error: "Card not found" },
      { status: 404 }
    );
  }

  await supabaseAdmin
    .from("card_favourites")
    .delete()
    .eq("user_id", user.id)
    .eq("card_id", card.id);

  return NextResponse.json({
    success: true,
  });
}