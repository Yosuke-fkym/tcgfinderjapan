import { Shop } from "@/types/types";

export function isShopOpen(shop: Shop): boolean {
  // 🇯🇵 Japan time
  const japanTime = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Tokyo",
    })
  );

  // 🗓️ Japanese weekdays
  const days = [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
  ];

  const todayKey = days[japanTime.getDay()];

  const currentTime = japanTime.toTimeString().slice(0, 5); // "HH:MM"

  // 🧠 TODO: holiday logic in future
  const isHoliday = false;

  let open = "";
  let close = "";

  if (isHoliday && shop.holiday_hours) {
    // 🎌 Holiday hours override
    open = shop.holiday_hours.open;
    close = shop.holiday_hours.close;
  } else {
    const today = shop.business_hours?.[todayKey];

    if (!today || today.closed) return false;

    open = today.open;
    close = today.close;
  }

  // Overnight case (e.g. 22:00 - 05:00)
  if (open > close) {
    return currentTime >= open || currentTime <= close;
  }

  // ✅ Normal case
  return currentTime >= open && currentTime <= close;
}