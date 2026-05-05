import { Shop } from "@/types/types";
import { isShopOpen } from "./getShopStatus";

export function transformShop(shop: any): Shop {
  return {
    shop_id: shop.shop_id,
    shop_name: shop.shop_name || "",
    shop_address: shop.shop_address || "",

    latitude: shop.latitude || 0,
    longitude: shop.longitude || 0,
    shop_address_in_langs: shop.shop_address_in_langs || undefined,
    shop_name_in_langs: shop.shop_name_in_langs || undefined,
    shop_desc_in_langs: shop.shop_desc_in_langs || undefined,
    productFlags:
      shop.shop_product_flags?.map((item: any) => item.product_flags?.name) || [],
    created_at: shop.created_at,
    business_hours: shop.business_hours,
    description: shop.description,
    area: shop.area || "",
    x_account_url: shop.x_account_url || null,
    holiday_hours: shop.holiday_hours,
    website: shop.website,
    images: shop.shop_photos?.map((p: any) => p.image_url) || [],

    language_support: shop.language_support
      ? shop.language_support.split("・")
      : [],

    isOpen: isShopOpen(shop),
    shopVideos: shop.shopVideos
  };
}
