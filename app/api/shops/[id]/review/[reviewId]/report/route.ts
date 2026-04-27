import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/serverAuth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const supabase = await createAuthClient();

    // 🔐 Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
        
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { review_id, reason } = body;

    if (!review_id) {
      return NextResponse.json(
        { error: "Review ID required" },
        { status: 400 }
      );
    }

    // 🚫 Check duplicate report
    const { data: existingReport } = await supabase
      .from("review_reports")
      .select("id")
      .eq("review_id", review_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingReport) {
      return NextResponse.json(
        { error: "Already reported" },
        { status: 409 }
      );
    }

    // 📝 Insert report
    const { error: insertError } = await supabase
      .from("review_reports")
      .insert({
        review_id,
        user_id: user.id,
        reason: reason || null,
      });
if (insertError) {
  // PostgreSQL unique violation error code
  if (insertError.code === "23505") {
    return NextResponse.json(
      { error: "Already reported" },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: insertError.message },
    { status: 500 }
  );
}

    // 🔥 OPTIONAL: Auto-flag logic
    const { count } = await supabase
      .from("review_reports")
      .select("*", { count: "exact", head: true })
      .eq("review_id", review_id);

    if ((count || 0) >= 3) {
      
      const {error} = await supabaseAdmin
        .from("reviews")
        .update({ is_flagged: true })
        .eq("id", review_id);
        console.log("err: ",error);
        
    }

    return NextResponse.json(
      { message: "Report submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("REPORT ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}