"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter, useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Spinner } from "./ui/spinner";
import { User, Menu, X, Globe } from "lucide-react";
import { getT } from "@/lib/getT";

interface UserType {
  authenticated: boolean;
  email: string | null;
  name: string | null;
  isAdmin: boolean | null;
}

function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const { locale } = useParams();
  const t = getT((locale as string) || "en");

  const [user, setUser] = useState<UserType | null | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
  if (!path) return;

  const segments = path.split("/");

  // replace existing locale
  if (segments[1] === "en" || segments[1] === "jp") {
    segments[1] = newLocale;
  } else {
    segments.unshift("", newLocale);
  }

  router.push(segments.join("/") || `/${newLocale}`);
  setMenuOpen(false);
};

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();

          if (userData.user?.id) {
            setUser({
              authenticated: true,
              email: userData.user.email,
              name: userData.user.user_metadata.name,
              isAdmin: userData.isAdmin,
            });
          } else {
            setUser({ authenticated: false, email: null, name: null, isAdmin: null });
          }
        } else {
          setUser({ authenticated: false, email: null, name: null, isAdmin: null });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser({ authenticated: false, email: null, name: null, isAdmin: null });
      }
    };

    checkAuth();
  }, [path]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser({ authenticated: false, email: null, name: null, isAdmin: null });
    router.push(`/${locale}/auth/login`);
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  const navItems = [

    { label: t.navbar.home, path: `/${locale}` },
    { label: t.navbar.ranking, path: `/${locale}/ranking` },
    { label: t.navbar.blog, path: `/${locale}/blog` },
    { label: t.navbar.contact, path: `/${locale}/contact` },
  ];

  return (
    <div className="relative">
      {/* NAVBAR */}
      <div className="h-14 flex items-center bg-[linear-gradient(220deg,#372950_0%,#1e1b2e_50%,#151420_100%)] justify-between px-4 sm:px-6 border-b border-white/20 shadow-sm">
        {/* LEFT */}
        <div
          className="font-semibold text-white text-lg cursor-pointer"
          onClick={() => router.push(`/${locale}`)}
        >
          {t.appName}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* DESKTOP NAV */}
          <ul className="sm:flex gap-6 hidden items-center text-sm text-white">
            {navItems.map((item) => (
              <li
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`cursor-pointer ${
                  path === item.path
                    ? "bg-white py-1.5 px-3 text-indigo-600 rounded-md font-semibold"
                    : ""
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>

          {/* LANGUAGE SWITCHER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-sm text-white hover:opacity-80 transition">
                <Globe size={16} />
                <span >
                  {(locale as string)?.toUpperCase() || "EN"}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                <span className="mr-2">🇺🇸</span>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("jp")}>
                <span className="mr-2">🇯🇵</span>
                日本語
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AUTH */}
          {user === undefined ? (
            <Spinner />
          ) : user?.authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar>
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {user?.isAdmin && (
  <DropdownMenuItem onClick={() => router.push(`/${locale}/admin`)}>
    {t.admin.sidebar.title}
  </DropdownMenuItem>
)}
                <DropdownMenuItem
  onClick={() => router.push(`/${locale}/accounts/me`)}
>
  {t.navbar.myPage}
</DropdownMenuItem>

<DropdownMenuItem
  onClick={() =>
    router.push(`/${locale}/accounts/me/favourite-shops`)
  }
>
  {t.navbar.favorites}
</DropdownMenuItem>

<DropdownMenuItem
  onClick={() =>
    router.push(`/${locale}/accounts/me/viewed-history`)
  }
>
  {t.navbar.viewedHistory}
</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  {t.navbar.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push(`/${locale}/auth/login`)}>
              <User size={15} /> {t.navbar.login}
            </Button>
          )}

          {/* HAMBURGER */}
          <button
            className="sm:hidden text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="sm:hidden bg-[#1e1b2e]/95 backdrop-blur-md text-white px-4 py-5 border-b border-white/10">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = path === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition
                    ${
                      isActive
                        ? "bg-white text-indigo-600 font-semibold shadow-sm"
                        : "hover:bg-white/10 active:scale-[0.98]"
                    }
                  `}
                >
                  <span>{item.label}</span>

                  <span
                    className={`text-xs ${
                      isActive ? "text-indigo-500" : "text-gray-400"
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}

            {/* MOBILE LANGUAGE SWITCHER
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs text-gray-400 mb-2">Language</p>

              <div className="flex gap-2">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`flex-1 py-2 rounded-md text-sm transition ${
                    (locale as string) === "en"
                      ? "bg-white text-indigo-600"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  🇺🇸 English
                </button>

                <button
                  onClick={() => changeLanguage("jp")}
                  className={`flex-1 py-2 rounded-md text-sm transition ${
                    (locale as string) === "jp"
                      ? "bg-white text-indigo-600"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  🇯🇵 日本語
                </button>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;