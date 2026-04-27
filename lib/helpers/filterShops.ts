import { Filters, Shop } from "@/types/types";
import { extractArea } from "./extractArea";

export function filterShops(
  shops: Shop[],
  filters: Filters,
  favorites: string[] // ✅ added
): Shop[] {
  return shops.filter((shop) => {
    const name = shop.shop_name?.toLowerCase() || "";
    const address = shop.shop_address?.toLowerCase() || "";
    const area = extractArea(shop.shop_address);

    if (
      filters.query &&
      !(name.includes(filters.query.toLowerCase()) ||
        address.includes(filters.query.toLowerCase()))
    ) {
      return false;
    }

    if (
      filters.area.length &&
      !filters.area.includes(area)
    ) {
      return false;
    }

    if (
      filters.productFlags.length &&
      !filters.productFlags.some((flag) =>
        shop.productFlags?.includes(flag)
      )
    ) {
      return false;
    }

    if (
      filters.language.length &&
      !filters.language.some((lang) =>
        shop.language_support?.includes(lang)
      )
    ) {
      return false;
    }

    if (filters.openNow && !shop.isOpen) {
      return false;
    }

    // ✅ NEW: favorites filter
    if (filters.favoritesOnly && !favorites.includes(shop.shop_id)) {
      return false;
    }

    return true;
  });
}