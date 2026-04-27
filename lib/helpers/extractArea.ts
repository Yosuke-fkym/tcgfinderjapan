export function extractArea(address?: string): string {
  if (!address) return "";

  // 🇯🇵 Japanese prefecture (都道府県)
  const jpMatch = address.match(/(.*?[都道府県])/);
  if (jpMatch) return jpMatch[0];

  // 🌍 fallback (English format: "Nagoya, Aichi")
  const enMatch = address.match(/,\s*(\w+)/);
  if (enMatch) return enMatch[1];

  return address;
}