"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Globe, Home, ChevronDown } from "lucide-react";
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
    if (!pathname || locale === newLocale) return;

    const segments = pathname.split("/");

    if (segments[1] === "en" || segments[1] === "jp") {
      segments[1] = newLocale;
    } else {
      segments.unshift("", newLocale);
    }

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
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] rounded-xl mx-2 md:mx-3 mt-2 px-4 md:px-5 py-2.5 flex flex-row sm:items-center justify-between gap-3">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600/10 to-indigo-600/[0.02] border border-indigo-500/15 flex items-center justify-center shrink-0">
          <ShieldCheck className="text-indigo-600" size={17} />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm sm:text-base text-gray-900 tracking-tight">
            {t.appName}
          </span>
          <span className="text-[11px] sm:text-xs text-gray-400">
            {t.admin.navbar.subtitle}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">

        {/* Go to Site */}
        <button
          onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
        >
          <Home size={15} />
          <span className="hidden sm:inline">
            {t.admin.navbar.goToSite}
          </span>
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block" />

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150">
              <Globe size={15} />
              <span className="hidden sm:inline">
                {(locale as string).toUpperCase()}
              </span>
              <ChevronDown size={12} className="opacity-50 hidden sm:inline" />
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

        <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block" />

        {/* Time */}
        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 font-medium text-gray-600 tabular-nums">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          {time}
        </span>
      </div>
    </div>
  );
}