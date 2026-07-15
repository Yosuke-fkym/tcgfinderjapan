import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/serverAuth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_: NextRequest) {
  try {
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

    // Get favorite card ids
    const { data: favorites, error: favoritesError } = await supabaseAdmin
      .from("card_favourites")
      .select("card_id")
      .eq("user_id", user.id);

    if (favoritesError) {
      return NextResponse.json(
        { error: favoritesError.message },
        { status: 400 }
      );
    }

    // No favorites
    if (!favorites || favorites.length === 0) {
      return NextResponse.json({
        data: [],
      });
    }

    const cardIds = favorites.map((f) => f.card_id);

    // Fetch cards
    const { data: cards, error: cardsError } = await supabaseAdmin
      .from("cards")
      .select("*")
      .in("id", cardIds);

    if (cardsError) {
      return NextResponse.json(
        { error: cardsError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: cards ?? [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}