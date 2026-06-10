import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Initialize response
  const response = NextResponse.next();

  // DevTools blocker exemption check
  const LAPTOP_IP = "103.136.58.119";
  const clientIp = (request as any).ip || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip");

  const hasExemptIp = clientIp === LAPTOP_IP;
  const hasDevtoolsParam = searchParams.get("devtools");

  if (hasDevtoolsParam === "true" || hasExemptIp) {
    response.cookies.set("ceklis_allow_devtools", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  } else if (hasDevtoolsParam === "false") {
    response.cookies.delete("ceklis_allow_devtools");
  }

  // Handle Admin/Dashboard Route Protection
  const protectedPaths = [
    "/dashboard",
    "/products",
    "/banners",
    "/gallery",
    "/testimonials",
    "/settings",
    "/users",
  ];

  const isProtected = protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (isProtected) {
    const sessionCookie = request.cookies.get("ceklis_session");
    const roleCookie = request.cookies.get("ceklis_role");

    // If session or role is missing, redirect to login
    if (!sessionCookie || !roleCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Developer mode route protection
    if (pathname.startsWith("/users") && roleCookie.value !== "developer") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

// Matching all pages except API and static assets
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
