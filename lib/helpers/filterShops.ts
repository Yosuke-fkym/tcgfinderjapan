import { Filters, Shop } from "@/types/types";
import { extractArea } from "./extractArea";

export function filterShops(
  shops: Shop[],
  filters: Filters,
  favorites: string[] // ✅ added
): Shop[] {
  return shops.filter((shop) => {
    const nameInJp = shop.shop_name?.toLowerCase() || "";
    const nameInEn = shop.shop_name_in_langs?.en?.toLowerCase() || "";
    const descInJp = shop.description?.toLowerCase() || "";
    const descInEn = shop.shop_desc_in_langs?.en?.toLowerCase() || "";
    const addressInJp = shop.shop_address?.toLowerCase() || "";
    const addressInEn = shop.shop_address_in_langs?.en?.toLowerCase() || "";

    const area = extractArea(shop.shop_address);

    if (
      filters.query &&
      !(nameInJp.includes(filters.query.toLowerCase()) ||
        nameInEn.includes(filters.query.toLowerCase()) ||
        descInJp.includes(filters.query.toLowerCase()) ||
        descInEn.includes(filters.query.toLowerCase()) ||
        addressInJp.includes(filters.query.toLowerCase()) ||
        addressInEn.includes(filters.query.toLowerCase()))
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