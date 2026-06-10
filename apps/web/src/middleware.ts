import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("ceklis_session");
  const roleCookie = request.cookies.get("ceklis_role");

  // Check if session or role is missing
  if (!sessionCookie || !roleCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Developer mode route protection
  if (pathname.startsWith("/users") && roleCookie.value !== "developer") {
    // Redirect non-developer users to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Matching paths that require admin access
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/banners/:path*",
    "/gallery/:path*",
    "/testimonials/:path*",
    "/settings/:path*",
    "/users/:path*",
  ],
};
