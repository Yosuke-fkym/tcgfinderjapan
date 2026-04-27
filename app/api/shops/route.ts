import { transformShop } from "@/lib/helpers/transformShop";
import { createAuthClient } from "@/lib/supabase/serverAuth";

// GET /api/shops - Get all shops
export async  function GET(){
    try {
        const supabase = await createAuthClient();

        const {data, error} = await supabase
        .from("shops")
        .select(`*, shop_product_flags(product_flags(id, name))`);

        if (error) {
            return Response.json({error: error.message}, {status: 400});
        }
        const transformed = data.map(transformShop)
        
        return Response.json({data: transformed}, {status: 200});

    } catch (error) {
        return Response.json({error: "An unexpected error occurred."}, {status: 500});
    }
}