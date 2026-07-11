// =========================
// 🔍 LANGUAGE DETECTION
// =========================
export function detectLang(text:string) {
  if (!text) return "en";
  const hasJapanese = /[\u3040-\u30ff\u4e00-\u9faf]/.test(text);
  return hasJapanese ? "jp" : "en"; 
}

// =========================
// ⏳ DELAY
// =========================
export function delay(ms:number) {
  return new Promise((res) => setTimeout(res, ms));
}