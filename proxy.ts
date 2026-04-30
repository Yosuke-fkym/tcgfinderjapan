import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAuthClient } from "./lib/supabase/serverAuth";

const locales = ["en", "jp"];
const defaultLocale = "jp";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔥 0. IGNORE STATIC FILES (IMPORTANT FIX)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".") // 🔥 handles og.png, jpg, svg etc
  ) {
    return NextResponse.next();
  }

  // 🔥 1. CHECK LOCALE
  const hasLocale = locales.some((locale) =>
    pathname.startsWith(`/${locale}`)
  );

  // 👉 redirect if no locale
  if (!hasLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, req.url)
    );
  }

  // 🔥 extract locale
  const locale = pathname.split("/")[1];

  // 🔥 clean path (remove locale)
  const cleanPath = pathname.replace(`/${locale}`, "") || "/";

  const res = NextResponse.next();
  const supabase = await createAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    cleanPath.startsWith("/auth/login") ||
    cleanPath.startsWith("/auth/signup");

  const isProtected = cleanPath.startsWith("/accounts");
  const isAdminRoute = cleanPath.startsWith("/admin");

  // 🚫 Not logged in
  if (!user && (isProtected || isAdminRoute)) {
    return NextResponse.redirect(
      new URL(`/${locale}/auth/login`, req.url)
    );
  }

  // 🔁 Already logged in
  if (user && isAuthPage) {
    return NextResponse.redirect(
      new URL(`/${locale}/map`, req.url)
    );
  }

  // 🔥 ADMIN CHECK
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(
        new URL(`/${locale}/`, req.url)
      );
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico).*)",
  ],
};