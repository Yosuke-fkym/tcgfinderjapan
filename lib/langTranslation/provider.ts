// =========================
// 🌐 TRANSLATE

import { detectLang } from "./util";

// =========================
export async function libreTranslate(
  text: string,
  source: string,
  target: string
) {
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: source === "jp" ? "ja" : source,
      target: target === "jp" ? "ja" : target,
      format: "text",
    }),
  });

  if (!res.ok) {
    throw new Error(`LibreTranslate failed (${res.status})`);
  }

  const contentType = res.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const body = await res.text();
    throw new Error("LibreTranslate returned HTML instead of JSON");
  }

  const data = await res.json();

  return data.translatedText;
}

export async function myMemoryTranslate(text: string, source: string, target: string) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${
      source === "jp" ? "ja" : source
    }|${target === "jp" ? "ja" : target}`
  );

  const data = await res.json();
  if (!data.responseData?.translatedText) {
  throw new Error("MyMemory translation failed");
}
  return data.responseData.translatedText;
}

// =========================
// 🔥 SAFE TRANSLATE
// =========================
export async function safeTranslate(text: string, target: string) {
  if (!text) return "";

  const source = detectLang(text);

  if (source === target) return text;

 try {
  const result = await libreTranslate(text, source, target);

  return result;
} catch (e) {
  console.warn(
    "LibreTranslate unavailable. Falling back to MyMemory."
  );

  const result = await myMemoryTranslate(text, source, target);

  return result;
}
}