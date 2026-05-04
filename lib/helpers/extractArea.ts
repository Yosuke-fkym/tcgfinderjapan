import { Shop } from "@/types/types";
import { AREA_MATCH } from "./areas";

// function extractArea(address?: string): string {
//   if (!address) return "";

//   // 🇯🇵 Japanese prefecture (都道府県)
//   const jpMatch = address.match(/(.*?[都道府県])/);
//   if (jpMatch) return jpMatch[0];

//   //  fallback (English format: "Nagoya, Aichi")
//   const enMatch = address.match(/,\s*(\w+)/);
//   if (enMatch) return enMatch[1];

//   return address;
// }


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