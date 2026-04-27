"use client"; 

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, User } from "lucide-react";
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

  if (isLoggedIn === null) {
    return (
      <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5"/>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5"/>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{t.account.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t.account.subtitle}
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-6 flex items-center gap-3 sm:gap-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {user.user_metadata.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium text-gray-800">
              {user.user_metadata.name}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail size={14} />
              {user.email}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={14} />
              {t.account.joined} {userJoinedDate}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t.stats.favoriteShops}</p>
            <p className="text-xl text-indigo-600 font-semibold mt-1">
              {favCount !== null ? favCount : "..."}
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t.stats.recentlyViewedShops}</p>
            <p className="text-xl text-indigo-600 font-semibold mt-1">
              {historyCount !== null ? historyCount : "..."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}