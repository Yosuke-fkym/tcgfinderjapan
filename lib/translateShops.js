import dotenv from "dotenv";
dotenv.config();

import { translate } from "@vitalets/google-translate-api";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ delay helper
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function run() {
  const { data: shops, error } = await supabase
    .from("shops")
    .select(
      "shop_id, shop_name, shop_name, description, shop_name_in_langs, shop_desc_in_langs");
  if (error) {
    console.error(error);
    return;
  }

  const BATCH_SIZE = 8; // 🔥 safe batch size

  for (let i = 0; i < shops.length; i += BATCH_SIZE) {
    const batch = shops.slice(i, i + BATCH_SIZE);

    console.log(`🚀 Processing batch ${i / BATCH_SIZE + 1}`);

    for (const shop of batch) {
      try {
        const existingName = shop.shop_name_in_langs || {};
        const existingDesc = shop.shop_desc_in_langs || {};


        // ✅ skip already translated
        if (existingName.en) continue;
        if (existingDesc.en) continue;

        const nameRes = await translate(
          shop.shop_name || "",
          { to: "en" }
        );

        const descRes = await translate(
          shop.description || "",
          { to: "en" }
        );

        await supabase
          .from("shops")
          .update({
            shop_name_in_langs: {
              ...existingName,
              en: nameRes.text,
            },
            shop_desc_in_langs: {
              ...existingDesc,
              en: descRes.text,
            },
          })
          .eq("shop_id", shop.shop_id);

        console.log(`✅ Done: ${shop.shop_name}`);

        // 🔥 per request delay
        await delay(1500);
      } catch (err) {
        console.error(`❌ Failed: ${shop.shop_name}`, err);
      }
    }

    // 🔥 batch pause (VERY IMPORTANT)
    console.log("⏸ Cooling down before next batch...");
    await delay(10000); // 10 sec pause
  }

  console.log("🎉 All batches completed");
}

run();