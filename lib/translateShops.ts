import { supabaseAdmin } from "@/lib/supabase/admin";
import { detectLang } from "../lib/langTranslation/util";
import { safeTranslate } from "../lib/langTranslation/provider";


export async function translateShop(
  shopId: string,
  overwrite: boolean = false
) {
  const { data: shop } = await supabaseAdmin
    .from("shops")
    .select(`
      shop_id,
      shop_name,
      description,
      shop_address,
      isTranslated,
      shop_name_in_langs,
      shop_desc_in_langs,
      shop_address_in_langs
    `)
    .eq("shop_id", shopId)
    .single();

  if (!shop) {
    throw new Error("Shop not found");
  }

  const base = shop.shop_name || "";
  const lang = detectLang(base);
  console.log(lang);
  

  const existingName = shop.shop_name_in_langs || {};
  const existingDesc = shop.shop_desc_in_langs || {};
  const existingAddress = shop.shop_address_in_langs || {};

  // =========================
  // 🔤 NAME
  // =========================

  const en =
    overwrite || !existingName.en
      ? lang === "en"
        ? base
        : await safeTranslate(base, "en")
      : existingName.en;

  const jp =
    overwrite || !existingName.jp
      ? lang === "jp"
        ? base
        : await safeTranslate(base, "jp")
      : existingName.jp;
      console.log("jp: ", jp);
      
      
  // =========================
  // 📝 DESCRIPTION
  // =========================

  const desc_en =
    overwrite || !existingDesc.en
      ? await safeTranslate(shop.description || "", "en")
      : existingDesc.en;

  const desc_jp =
    overwrite || !existingDesc.jp
      ? await safeTranslate(shop.description || "", "jp")
      : existingDesc.jp;
      console.log("jp: ", desc_jp);
      
      // =========================
  // 📍 ADDRESS
  // =========================

  const addr_en =
    overwrite || !existingAddress.en
      ? await safeTranslate(shop.shop_address || "", "en")
      : existingAddress.en;

  const addr_jp =
    overwrite || !existingAddress.jp
      ? await safeTranslate(shop.shop_address || "", "jp")
      : existingAddress.jp;
      console.log("jp: ", addr_jp);

  const { error } = await supabaseAdmin
    .from("shops")
    .update({
      isTranslated: true,
      shop_name_in_langs: {
        ...existingName,
        en,
        jp,
      },
      shop_desc_in_langs: {
        ...existingDesc,
        en: desc_en,
        jp: desc_jp,
      },
      shop_address_in_langs: {
        ...existingAddress,
        en: addr_en,
        jp: addr_jp,
      },
    })
    .eq("shop_id", shop.shop_id);

  if (error) {
    throw error;
  }

  return {
    success: true,
    shopId: shop.shop_id,
  };
}