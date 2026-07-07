import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "./lib/authConstants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  if (!isAdminRoute) return NextResponse.next();

  const authenticated = request.cookies.get(ADMIN_COOKIE)?.value === "ok";
  if (authenticated) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
