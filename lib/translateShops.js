import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// =========================
// 🔍 LANGUAGE DETECTION
// =========================
function detectLang(text) {
  if (!text) return "en";
  const hasJapanese = /[\u3040-\u30ff\u4e00-\u9faf]/.test(text);
  return hasJapanese ? "jp" : "en"; 
}

// =========================
// ⏳ DELAY
// =========================
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// =========================
// 🌐 TRANSLATE
// =========================
async function libreTranslate(text, source, target) {
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: source === "jp" ? "ja" : source, 
      target: target === "jp" ? "ja" : target,
      format: "text",
    }),
  });

  if (!res.ok) throw new Error("LibreTranslate failed");

  const data = await res.json();
  return data.translatedText;
}

async function myMemoryTranslate(text, source, target) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${
      source === "jp" ? "ja" : source
    }|${target === "jp" ? "ja" : target}`
  );

  const data = await res.json();
  return data.responseData.translatedText;
}

// =========================
// 🔥 SAFE TRANSLATE
// =========================
async function safeTranslate(text, target) {
  if (!text) return "";

  const source = detectLang(text);

  if (source === target) return text;

  try {
    return await libreTranslate(text, source, target);
  } catch {
    console.log("⚠️ Libre failed → fallback");
    return await myMemoryTranslate(text, source, target);
  }
}

// =========================
// 🚀 MAIN SCRIPT
// =========================
async function run() {
  console.log("🚀 STARTING");

  const { data: shops } = await supabase
    .from("shops")
    .select(
      "shop_id, shop_name, description, shop_address, shop_name_in_langs, shop_desc_in_langs, shop_address_in_langs"
    );

  const BATCH_SIZE = 3;

  for (let i = 0; i < shops.length; i += BATCH_SIZE) {
    const batch = shops.slice(i, i + BATCH_SIZE);

    for (const shop of batch) {
      try {
        const base = shop.shop_name || "";
        const lang = detectLang(base);

        const existingName = shop.shop_name_in_langs || {};
        const existingDesc = shop.shop_desc_in_langs || {};
        const existingAddress = shop.shop_address_in_langs || {};

        // =========================
        // 🔤 NAME
        // =========================
        const en =
          existingName.en ||
          (lang === "en"
            ? base
            : await safeTranslate(base, "en"));

        const jp =
          existingName.jp ||
          (lang === "jp"
            ? base
            : await safeTranslate(base, "jp"));

        // =========================
        // 📝 DESC
        // =========================
        const desc_en =
          existingDesc.en ||
          (await safeTranslate(shop.description || "", "en"));

        const desc_jp =
          existingDesc.jp ||
          (await safeTranslate(shop.description || "", "jp"));

        // =========================
        // 📍 ADDRESS
        // =========================
        const addr_en =
          existingAddress.en ||
          (await safeTranslate(shop.shop_address || "", "en"));

        const addr_jp =
          existingAddress.jp ||
          (await safeTranslate(shop.shop_address || "", "jp"));

        // =========================
        // 💾 UPDATE
        // =========================
        await supabase
          .from("shops")
          .update({
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

        console.log(`✅ Done: ${base}`);

        await delay(2000);
      } catch (err) {
        console.error(`❌ Failed: ${shop.shop_name}`, err);
      }
    }

    console.log("⏸ Cooling...");
    await delay(15000);
  }

  console.log("🎉 DONE");
}

run();