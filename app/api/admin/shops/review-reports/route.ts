import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from("review_reports")
    .select(`
      id,
      reason,
      created_at,
      review_id,
      user_id,
      status,
      review: reviews (
        id,
        shop_id,
        user_id,
        comment,
        user_id,
        rating,
        photo_url,
        posted_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}


// Admin action to delete the review and mark the report as resolved
export async function DELETE(req: Request){
    const { reviewId, reportId } = await req.json();

    if(!reviewId || !reportId){
        return NextResponse.json({error: "Missing reviewId or reportId"},{ status: 400});
    }

    const {error: deleteReviewError} = await supabaseAdmin
    .from("reviews")
    .delete()
    .eq("id", reviewId);

    if(deleteReviewError){
        return NextResponse.json({error: deleteReviewError.message}, {status: 500});
    }
    return NextResponse.json({message: "Review deleted and report resolved"});
}


export async function POST(req: Request){
    const { reportId, status } = await req.json();

    if(!reportId){
        return NextResponse.json({error: "Missing reportId"},{ status: 400});
    }

    const {error} = await supabaseAdmin
    .from("review_reports")
    .update({ status: status })
    .eq("id", reportId);


    if(error){
        
        return NextResponse.json({error: error.message}, {status: 500});
    }
    return NextResponse.json({message: "Report marked as " + status});
}