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
import logo from "@/assets/logo.png";
import {
  User,
  Menu,
  X,
  Globe,
  UserCog2,
  Store,
  LucideCreditCard,
  History,
  LogOut,
  ChevronRight,
} from "lucide-react";
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

    // Replace existing locale
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
            setUser({
              authenticated: false,
              email: null,
              name: null,
              isAdmin: null,
            });
          }
        } else {
          setUser({
            authenticated: false,
            email: null,
            name: null,
            isAdmin: null,
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);

        setUser({
          authenticated: false,
          email: null,
          name: null,
          isAdmin: null,
        });
      }
    };

    checkAuth();
  }, [path]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser({
      authenticated: false,
      email: null,
      name: null,
      isAdmin: null,
    });

    setMenuOpen(false);
    router.push(`/${locale}/auth/login`);
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  const navItems = [
    {
      label: t.navbar.home,
      path: `/${locale}/blog`,
    },
    {
      label: t.navbar.map,
      path: `/${locale}/map`,
    },
    {
      label: t.navbar.ranking,
      path: `/${locale}/ranking`,
    },
    // { label: t.navbar.cards, path: `/${locale}/cards` },
    {
      label: t.navbar.blog,
      path: `/${locale}/blog`,
    },
    {
      label: t.navbar.contact,
      path: `/${locale}/contact`,
    },
  ];

  return (
    <div className="sticky top-0 left-0 z-99">
      {/* NAVBAR */}
      <div
        className="
          h-16
          flex
          items-center
          justify-between
          bg-[#08080b]/85
          backdrop-blur-xl
          px-3
          min-[400px]:px-4
          lg:px-6
          border-b
          border-white/10
        "
      >
        {/* LEFT / LOGO */}
        <div
          className="flex items-center cursor-pointer group shrink-0"
          onClick={() => router.push(`/${locale}/blog`)}
        >
          <img
            src={logo.src}
            alt="TCG Finder Japan"
            className="
              w-[170px]
              min-[400px]:w-[165px]
              lg:w-[180px]
              h-auto
              object-contain
              transition-opacity
              group-hover:opacity-85
            "
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* ================================
              DESKTOP NAV
              Visible only on lg and above
          ================================= */}
          <ul className="hidden lg:flex gap-1 items-center text-sm">
            {navItems.map((item, index) => {
              const isActive = path === item.path;

              return (
                <li
                  key={index}
                  onClick={() => router.push(item.path)}
                  className={`cursor-pointer px-3.5 py-1.5 rounded-full transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25 font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/6 border border-transparent"
                  }`}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>

          {/* DESKTOP DIVIDER */}
          <div className="hidden lg:block w-px h-5 bg-white/10 mx-1" />

          {/* ================================
              LANGUAGE SWITCHER
              Desktop only
              On smaller screens it is inside
              hamburger menu
          ================================= */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="outline-none focus:outline-none cursor-pointer"
                asChild
              >
                <button
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-sm
                    text-white/70
                    hover:text-white
                    hover:bg-white/6
                    border
                    border-white/10
                    px-2.5
                    py-1.5
                    rounded-full
                    transition-colors
                  "
                >
                  <Globe size={15} />
                  <span>
                    {(locale as string)?.toUpperCase() || "EN"}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-36 relative z-999"
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeLanguage("en")}
                >
                  <span className="mr-2">🇺🇸</span>
                  English
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeLanguage("jp")}
                >
                  <span className="mr-2">🇯🇵</span>
                  日本語
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ================================
              AUTH
              Visible on all screen sizes
          ================================= */}
          {user === undefined ? (
            <Spinner />
          ) : user?.authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="outline-none cursor-pointer focus:outline-none"
                asChild
              >
                <button className="rounded-full ring-2 ring-indigo-500/30 hover:ring-indigo-500/50 transition-all">
                  <Avatar>
                    <AvatarFallback className="bg-linear-to-br from-indigo-600 to-indigo-800 text-white text-xs font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-45 relative z-999"
                align="end"
              >
                {user?.isAdmin && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/${locale}/admin`)}
                  >
                    <UserCog2 />
                    {t.admin.sidebar.title}
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/${locale}/accounts/me`)
                  }
                >
                  <User />
                  {t.navbar.myPage}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/${locale}/accounts/me/favourite-shops`
                    )
                  }
                >
                  <Store />
                  {t.navbar.favoritesShops}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/${locale}/accounts/me/favourite-cards`
                    )
                  }
                >
                  <LucideCreditCard />
                  {t.navbar.favoritesCard}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/${locale}/accounts/me/viewed-history`
                    )
                  }
                >
                  <History />
                  {t.navbar.viewedHistory}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut />
                  {t.navbar.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() =>
                router.push(`/${locale}/auth/login`)
              }
              className="
                bg-indigo-600
                hover:bg-indigo-500
                rounded-full
                px-3
                min-[400px]:px-4
              "
            >
              <User size={15} />
              {t.navbar.login}
            </Button>
          )}

          {/* ================================
              HAMBURGER
              Visible below lg
          ================================= */}
          <button
            className="
              lg:hidden
              w-8
              h-8
              flex
              items-center
              justify-center
              rounded-full
              text-white/80
              hover:bg-white/6
              transition-colors
              shrink-0
            "
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* =====================================
          TABLET / MOBILE MENU
          Visible below lg
      ====================================== */}
      {menuOpen && (
        <div
          className="
            lg:hidden
            bg-[#08080b]/95
            backdrop-blur-xl
            text-white
            px-4
            py-4
            border-b
            border-white/10
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
          "
        >
          <div className="flex flex-col gap-1">
            {/* NAVIGATION */}
            {navItems.map((item, index) => {
              const isActive = path === item.path;

              return (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.path);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25 font-medium"
                      : "text-white/70 hover:bg-white/6 active:scale-[0.98]"
                  }`}
                >
                  <span>{item.label}</span>

                  <ChevronRight
                    size={15}
                    className={
                      isActive
                        ? "text-indigo-400"
                        : "text-white/25"
                    }
                  />
                </button>
              );
            })}

            {/* ================================
                LANGUAGE SWITCHER
            ================================= */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="px-4 pb-2 text-xs uppercase tracking-wider text-white/30">
                Language
              </p>

              <button
                onClick={() => changeLanguage("en")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-colors ${
                  locale === "en"
                    ? "bg-indigo-600/15 text-indigo-300"
                    : "text-white/70 hover:bg-white/6"
                }`}
              >
                <span>🇺🇸</span>
                <span>English</span>
              </button>

              <button
                onClick={() => changeLanguage("jp")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-colors ${
                  locale === "jp"
                    ? "bg-indigo-600/15 text-indigo-300"
                    : "text-white/70 hover:bg-white/6"
                }`}
              >
                <span>🇯🇵</span>
                <span>日本語</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;