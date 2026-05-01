import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ delay helper
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// 🔥 LibreTranslate
async function libreTranslate(text) {
  if (!text) return "";

  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "ja",
      target: "en",
      format: "text",
    }),
  });

  if (!res.ok) throw new Error("LibreTranslate failed");

  const data = await res.json();
  return data.translatedText;
}

// 🔁 fallback
async function myMemoryTranslate(text) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=ja|en`
  );

  const data = await res.json();
  return data.responseData.translatedText;
}

// 🔥 safe wrapper
async function safeTranslate(text) {
  try {
    return await libreTranslate(text);
  } catch {
    console.log("⚠️ Libre failed, fallback...");
    return await myMemoryTranslate(text);
  }
}

async function run() {
  console.log("🚀 STARTING TRANSLATION SCRIPT");

  // =========================
  // 🟢 1. SHOPS TRANSLATION
  // =========================
  const { data: shops } = await supabase
    .from("shops")
    .select(
      "shop_id, shop_name, description, shop_address, shop_name_in_langs, shop_desc_in_langs, shop_address_in_langs"
    );

  const BATCH_SIZE = 3;

  for (let i = 0; i < shops.length; i += BATCH_SIZE) {
    const batch = shops.slice(i, i + BATCH_SIZE);

    console.log(`🏪 Shop batch ${i / BATCH_SIZE + 1}`);

    for (const shop of batch) {
      try {
        const existingName = shop.shop_name_in_langs || {};
        const existingDesc = shop.shop_desc_in_langs || {};
        const existingAddress = shop.shop_address_in_langs || {};

        // ✅ skip ALL if already translated
        if (
          existingName.en &&
          existingDesc.en &&
          existingAddress.en
        )
          continue;

        const name =
          existingName.en ||
          (await safeTranslate(shop.shop_name || ""));

        const desc =
          existingDesc.en ||
          (await safeTranslate(shop.description || ""));

        const address =
          existingAddress.en ||
          (await safeTranslate(shop.shop_address || ""));

        await supabase
          .from("shops")
          .update({
            shop_name_in_langs: {
              ...existingName,
              en: name,
            },
            shop_desc_in_langs: {
              ...existingDesc,
              en: desc,
            },
            shop_address_in_langs: {
              ...existingAddress,
              en: address,
            },
          })
          .eq("shop_id", shop.shop_id);

        console.log(`✅ Shop done: ${shop.shop_name}`);

        await delay(2000);
      } catch (err) {
        console.error(`❌ Shop failed: ${shop.shop_name}`, err);
      }
    }

    console.log("⏸ Cooling (shops)...");
    await delay(15000);
  }

  // =========================
  // 🟣 2. REVIEWS TRANSLATION
  // =========================
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, comment, review_text_in_langs");

  for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
    const batch = reviews.slice(i, i + BATCH_SIZE);

    console.log(`📝 Review batch ${i / BATCH_SIZE + 1}`);

    for (const review of batch) {
      try {
        const existing = review.review_text_in_langs || {};

        // ✅ skip if already done
        if (existing.en) continue;

        const translated = await safeTranslate(
          review.comment || ""
        );

        await supabase
          .from("reviews")
          .update({
            review_text_in_langs: {
              ...existing,
              en: translated,
            },
          })
          .eq("id", review.id);

        console.log(`✅ Review done: ${review.id}`);

        await delay(2000);
      } catch (err) {
        console.error(`❌ Review failed: ${review.id}`, err);
      }
    }

    console.log("⏸ Cooling (reviews)...");
    await delay(15000);
  }

  console.log("🎉 ALL DONE");
}

run();