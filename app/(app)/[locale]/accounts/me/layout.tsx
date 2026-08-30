"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ClockArrowUpIcon, CreditCardIcon, Store, User2 } from "lucide-react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getT } from "@/lib/getT";

const getBreadcrumb = (pathname: string, t: any) => {
  const parts = pathname.split("/").filter(Boolean);

  return parts.map((part, index) => {
    const href = "/" + parts.slice(0, index + 1).join("/");

    const map: Record<string, string> = {
      accounts: t.accountLayout.breadcrumb.account,
      me: t.accountLayout.breadcrumb.myPage,
      "favourite-shops": t.accountLayout.breadcrumb.favorites,
      "viewed-history": t.accountLayout.breadcrumb.viewedHistory,
    };

    return {
      label: map[part] || part,
      href,
    };
  });
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale } = useParams();
  const t = getT(locale as string);
  const router = useRouter();
  const breadcrumbs = getBreadcrumb(pathname, t);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const navItems = [
    {
      label: t.accountLayout.profile,
      icon: User2,
      href: `/${locale}/accounts/me`,
    },
    {
      label: t.accountLayout.breadcrumb.favorites,
      icon: Store,
      href: `/${locale}/accounts/me/favourite-shops`,
    },
    {
      label: t.accountLayout.breadcrumb.favouritesCard,
      icon: CreditCardIcon,
      href: `/${locale}/accounts/me/favourite-cards`,
    },
    {
      label: t.accountLayout.breadcrumb.viewedHistory,
      icon: ClockArrowUpIcon,
      href: `/${locale}/accounts/me/viewed-history`,
    },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.user?.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace(`/${locale}/auth/login`);
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return (
      <div className="bg-[#08080b] min-h-[60vh] text-sm text-white/40 flex justify-center items-center gap-2">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#08080b] overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-125 w-225 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-100 w-100 rounded-full bg-violet-500/6 blur-[110px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-6 pb-16">
        {/* Top row: back + breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            onClick={() => router.push(`/${locale}/map`)}
            className="flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={16} />
            {t.accountLayout.back}
          </button>

          <div className="hidden sm:flex items-center gap-1 text-xs text-white/30 flex-wrap">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <div key={crumb.href} className="flex items-center gap-1">
                  <span
                    className={`transition-colors ${
                      isLast
                        ? "text-white/60 font-medium"
                        : crumb.label === t.accountLayout.breadcrumb.account
                          ? "text-white/30 cursor-default"
                          : "hover:text-indigo-400 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (
                        crumb.label !== t.accountLayout.breadcrumb.account &&
                        !isLast
                      ) {
                        router.push(crumb.href);
                      }
                    }}
                  >
                    {crumb.label}
                  </span>
                  {i < breadcrumbs.length - 1 && (
                    <ChevronRight size={12} className="text-white/15" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal pill nav — dashboard tab strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "whitespace-nowrap px-4 py-2 cursor-pointer rounded-full text-sm transition-colors duration-150 flex items-center gap-2 shrink-0",
                  isActive
                    ? "bg-indigo-600 text-white font-medium shadow-[0_0_0_1px_rgba(99,102,241,0.3)]"
                    : "bg-white/3 border border-white/10 text-white/55 hover:text-white hover:bg-white/6",
                )}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Full-width dashboard content */}
        {children}
      </div>
    </div>
  );
}
