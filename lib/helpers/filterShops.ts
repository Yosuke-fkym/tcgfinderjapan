import { Filters, Shop } from "@/types/types";
import { extractArea, extractAreaMulti } from "./extractArea";

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

    // const area = extractArea(shop.shop_address || "");
    // const areaMulti = extractAreaMulti(shop, "en");

    // if (
    //   filters.area.length &&
    //   !(
    //     (area !== null && filters.area.includes(area)) ||
    //     (areaMulti !== null && filters.area.includes(areaMulti))
    //   )
    // ) {
    //   return false;
    // }

    if (
  filters.area.length &&
  (!shop.area || !filters.area.includes(shop.area))
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
        typeof lang === "string" && shop.language_support?.includes(lang)
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