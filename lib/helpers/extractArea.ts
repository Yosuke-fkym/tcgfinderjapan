import { Shop } from "@/types/types";
import { AREA_MATCH } from "./areas";


export function extractArea(address: string): string | null {
  if (!address) return null;

  const lower = address.toLowerCase();

  for (const [key, keywords] of Object.entries(AREA_MATCH)) {
    if (
      keywords.some((word) =>
        lower.includes(word.toLowerCase())
      )
    ) {
      return key;
    }
  }

  return null;
}

 export function extractAreaMulti(shop: Shop, lang: string) {
  const address =
    shop.shop_address;

  return extractArea(address);
}