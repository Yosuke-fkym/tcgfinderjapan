import { createAuthClient } from "@/lib/supabase/serverAuth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, {params}: {params: any}){
    const supabase = await createAuthClient();
    const {reviewId} = await params;

    const {data: {user}} = await supabase.auth.getUser();

    if(!user){
        return Response.json({error: "Unauthorized"}, {status: 401});
    }

    // check existing like
    const {data: existing} = await supabase
    .from("review_likes")
    .select("*")
    .eq("review_id", reviewId)
    .eq("user_id", user.id)
    .maybeSingle()


    if(existing){
        // unlike
        await supabase
        .from("review_likes")
        .delete()
        .eq("id", existing.id)

        return Response.json({liked: false});
    }else{
        // like
        const {error} = await supabase
      .from("review_likes")
      .insert({
        review_id: reviewId,
        user_id: user.id,
      });
      

    return Response.json({ liked: true });
    }

}