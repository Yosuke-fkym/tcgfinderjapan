"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, CalendarClock, Heart, History, Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow, parseISO } from "date-fns";
import { checkUser } from "@/lib/helpers/getUser";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export default function MyAccountPageComponent() {
  const [user, setUser] = useState<any>(null);
  const [userJoinedDate, setUserJoinedDate] = useState<string | null>(null)
  const [favCount, setFavCount] = useState<number | null>(null);
  const [historyCount, setHistoryCount] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  useEffect(() => {
    checkUser({setIsLoggedIn, setUser})
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/shops/viewed_history", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data?.data) return;
        setHistoryCount(data.data.length);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    if(user){
      const timeAgo = formatDistanceToNow(parseISO(user.created_at), {
        addSuffix: true,
      });
      setUserJoinedDate(timeAgo)
    }
  }, [user])
  

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/favourites", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data?.data) return;
        setFavCount(data.data.length);
      });
  }, [isLoggedIn]);

  if (isLoggedIn === null || !user) {
    return (
      <div className="text-sm text-white/40 min-h-[50vh] flex justify-center items-center gap-2">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {t.account.title}
        </h1>
        <p className="text-sm text-white/45 mt-1">{t.account.subtitle}</p>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4">
        {/* GREETING / PROFILE — large tile */}
        <div className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/[0.10] via-white/[0.02] to-transparent p-6 sm:p-8 flex flex-col justify-between min-h-[260px]">
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/15 blur-3xl" />
          <Sparkles className="absolute top-6 right-6 w-4 h-4 text-indigo-400/40" />

          <div className="relative flex items-center gap-4 sm:gap-5">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-indigo-500/30 shrink-0">
              <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-semibold">
                {user.user_metadata.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-xl sm:text-2xl font-semibold text-white truncate">
                {user.user_metadata.name}
              </p>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Mail size={14} className="text-indigo-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="relative mt-6 pt-5 border-t border-white/10">
            <div className="inline-flex items-center gap-2 text-xs text-white/45 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5">
              <CalendarClock size={13} className="text-indigo-400" />
              {t.account.joined} {userJoinedDate}
            </div>
          </div>
        </div>

        {/* FAVORITES — stat tile */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5 flex flex-col justify-between hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600/20 to-indigo-600/[0.02] border border-indigo-500/25 flex items-center justify-center mb-4">
            <Heart size={16} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-3xl text-white font-semibold tabular-nums leading-none">
              {favCount !== null ? favCount : "···"}
            </p>
            <p className="text-sm text-white/45 mt-2">{t.stats.favoriteShops}</p>
          </div>
        </div>

        {/* HISTORY — stat tile */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5 flex flex-col justify-between hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600/20 to-indigo-600/[0.02] border border-indigo-500/25 flex items-center justify-center mb-4">
            <History size={16} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-3xl text-white font-semibold tabular-nums leading-none">
              {historyCount !== null ? historyCount : "···"}
            </p>
            <p className="text-sm text-white/45 mt-2">{t.stats.recentlyViewedShops}</p>
          </div>
        </div>
      </div>
    </div>
  );
}