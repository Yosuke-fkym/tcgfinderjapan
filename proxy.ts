
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAuthClient } from "./lib/supabase/serverAuth";

const locales = ["en", "jp"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Normalize both /en/admin and /admin to /admin
  const segments = pathname.split("/");
  const hasLocale = locales.includes(segments[1]);

  const cleanPath = hasLocale
    ? "/" + segments.slice(2).join("/")
    : pathname;

  if (hasLocale) {
    const redirectPath = cleanPath === "/blog" ? "/" : cleanPath;
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = redirectPath;
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/blog") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  const isAuthPage =
    cleanPath === "/auth/login" ||
    cleanPath === "/auth/signup";

  const isProtected =
    cleanPath === "/accounts" ||
    cleanPath.startsWith("/accounts/");

  const isAdminRoute =
    cleanPath === "/admin" ||
    cleanPath.startsWith("/admin/");

  // Public routes don't need auth checks
  if (!isAuthPage && !isProtected && !isAdminRoute) {
    return NextResponse.next();
  }

  const supabase = await createAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user && (isProtected || isAdminRoute)) {
    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    );
  }

  // Already logged in
  if (user && isAuthPage) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  // Admin authorization
  if (user && isAdminRoute) {
    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      error ||
      !profile ||
      profile.role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
