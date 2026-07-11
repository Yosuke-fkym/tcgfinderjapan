import { translateShop } from "@/lib/translateShops";


export async function POST(req: Request) {
  try {
    const { shopId, overwrite = false } = await req.json();

    const result = await translateShop(shopId, overwrite);

    return Response.json(result);
  } catch (error: any) {
  console.error("Translation API Error:", error);

  return Response.json(
    {
      success: false,
      error: error?.message ?? String(error),
    },
    {
      status: 500,
    }
  );
}
}