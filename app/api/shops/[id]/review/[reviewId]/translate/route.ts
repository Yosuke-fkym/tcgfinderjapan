import { NextRequest, NextResponse } from "next/server";
import { detectLang } from "@/lib/langTranslation/util";
import { safeTranslate } from "@/lib/langTranslation/provider";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: any }
) {
  const {reviewId} = await params;
  
  try {

    const { count } = await supabaseAdmin
.from("reviews")
.select("*", {
  count: "exact",
  head: true
});

console.log(count);
    const { target } = await req.json();

    if (!target || !["en", "jp"].includes(target)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid target language",
        },
        { status: 400 }
      );
    }

    const { data: review, error } = await supabaseAdmin
      .from("reviews")
      .select("id, comment, review_text_in_langs")
      .eq("id", reviewId)
      .single();

    if (error || !review) {
      return NextResponse.json(
        {
          success: false,
          error: "Review not found",
        },
        { status: 404 }
      );
    }

    const translations = review.review_text_in_langs || {};

    // ✅ Already translated
    if (translations[target]) {
      return NextResponse.json({
        success: true,
        translatedText: translations[target],
        cached: true,
      });
    }

    const source = detectLang(review.comment || "");

    // Original language == target
    if (source === target) {
      return NextResponse.json({
        success: true,
        translatedText: review.comment,
        cached: true,
      });
    }

    // Translate
    const translated = await safeTranslate(review.comment || "", target);

    const updatedTranslations = {
      ...translations,
      [source]: review.comment,
      [target]: translated,
    };

    console.log("review.id =", review.id);
console.log("reviewId =", reviewId);
    const { data, error: updateError } = await supabaseAdmin
      .from("reviews")
      .update({
        review_text_in_langs: updatedTranslations,
      })
      .eq("id", review.id)
      .select();

      console.log("logss: ", data, updateError);
      


    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      translatedText: translated,
      cached: false,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}