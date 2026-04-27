"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClockArrowUpIcon, Store, User2 } from "lucide-react";
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
      <div className="text-sm text-gray-500 min-h-[60vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  return (
    <div className="mx-auto pt-4 pb-10">
      {/* Top section */}
      <div className="max-w-6xl px-4 sm:px-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          
          {/* Back Button */}
          <button
            onClick={() => router.push(`/${locale}/map`)}
            className="flex items-center gap-2 text-xs sm:text-sm text-white hover:text-gray-400"
          >
            <ArrowLeft size={16} />
            {t.accountLayout.back}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 flex-wrap">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;

              return (
                <div key={crumb.href} className="flex items-center gap-1">
                  <span
                    className={`${
                      isLast
                        ? "text-white font-medium"
                        : crumb.label === t.accountLayout.breadcrumb.account
                        ? "text-gray-400 cursor-default"
                        : "hover:underline cursor-pointer"
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
                    <ChevronRight size={14} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        
        {/* Sidebar */}
        <Card className="p-3 md:p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3 hidden md:block">
            {t.account.title}
          </h2>

          {/* Nav */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "whitespace-nowrap px-3 py-2 cursor-pointer rounded-md text-sm transition flex items-center gap-1",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  <item.icon size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Content */}
        <div className="md:col-span-3">
          <Card className="p-4 md:p-6">{children}</Card>
        </div>
      </div>
    </div>
  );
}