"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Globe, Home } from "lucide-react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { getT } from "@/lib/getT";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminNavbar() {
  const [time, setTime] = useState("");
  const { locale } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = getT(locale as string);

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/") || `/${newLocale}`);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(formatDate(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  function formatDate(date: Date) {
    return date.toLocaleString(locale === "jp" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  return (
    <div className="bg-white border shadow-sm rounded-xl mx-2 md:mx-3 mt-2 px-4 md:px-6 py-3 flex flex-row sm:items-center justify-between gap-3">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-indigo-600" size={18} />

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm sm:text-base text-gray-800">
            {t.appName}
          </span>
          <span className="text-xs text-gray-500">
            {t.admin.navbar.subtitle}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-3">

        {/* 🏠 Go to Site */}
        <button
          onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition"
        >
          <Home size={16} />
          <span className="hidden sm:inline">
            {t.admin.navbar.goToSite}
          </span>
        </button>

        {/* 🌍 Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-gray-600 hover:text-black transition">
              <Globe size={16} />
              <span className="hidden sm:inline">
                {(locale as string).toUpperCase()}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeLanguage("en")}>
              🇺🇸 English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("jp")}>
              🇯🇵 日本語
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time */}
        <span className="font-medium text-gray-700">{time}</span>
      </div>
    </div>
  );
}