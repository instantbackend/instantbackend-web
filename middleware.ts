import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const isAppRoute = request.nextUrl.pathname.startsWith("/app");
  if (!isAppRoute) return NextResponse.next();

  const hasToken = request.cookies.get(AUTH_COOKIE_NAME);
  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};

