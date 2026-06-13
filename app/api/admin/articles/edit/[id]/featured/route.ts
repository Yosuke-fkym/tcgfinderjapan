// app/api/admin/articles/edit/[id]/featured/route.ts
// PATCH /api/admin/articles/edit/:id/featured
// Toggles is_featured for a single article.

import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing article id" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { is_featured } = body as { is_featured?: boolean };

    if (typeof is_featured !== "boolean") {
      return NextResponse.json(
        { success: false, error: "is_featured must be a boolean" },
        { status: 400 }
      );
    }



    const { data, error } = await supabaseAdmin
      .from("articles") 
      .update({ is_featured })
      .eq("id", id)
      .select("id, is_featured")
      .single();

    if (error) {
      console.error("[featured toggle] supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, is_featured: data.is_featured });
  } catch (err) {
    console.error("[featured toggle] unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}