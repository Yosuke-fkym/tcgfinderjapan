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

// 🔥 LibreTranslate function
async function libreTranslate(text) {
  if (!text) return "";

  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

// 🔁 fallback (MyMemory)
async function myMemoryTranslate(text) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=ja|en`
  );

  const data = await res.json();
  return data.responseData.translatedText;
}

// 🔥 main wrapper (fallback logic)
async function safeTranslate(text) {
  try {
    return await libreTranslate(text);
  } catch (err) {
    console.log("⚠️ Libre failed, using fallback...");
    return await myMemoryTranslate(text);
  }
}

async function run() {
  const { data: shops, error } = await supabase
    .from("shops")
    .select(
      "shop_id, shop_name, shop_address, shop_address_in_langs"
    );

  if (error) {
    console.error(error);
    return;
  }

  const BATCH_SIZE = 3; // 🔥 safer than 1 (balanced)

  for (let i = 0; i < shops.length; i += BATCH_SIZE) {
    const batch = shops.slice(i, i + BATCH_SIZE);

    console.log(`🚀 Processing batch ${i / BATCH_SIZE + 1}`);

    for (const shop of batch) {
      try {
        const existingLocation = shop.shop_address_in_langs || {};

        // ✅ skip already translated
        if (existingLocation.en) continue;

        const translated = await safeTranslate(
          shop.shop_address || ""
        );

        await supabase
          .from("shops")
          .update({
            shop_address_in_langs: {
              ...existingLocation,
              en: translated,
            },
          })
          .eq("shop_id", shop.shop_id);

        console.log(`✅ Done: ${shop.shop_name}`);

        // 🔥 per request delay
        await delay(2000);
      } catch (err) {
        console.error(`❌ Failed: ${shop.shop_name}`, err);
      }
    }

    console.log("⏸ Cooling down before next batch...");
    await delay(15000); // 🔥 batch cooldown
  }

  console.log("🎉 All batches completed");
}

run();