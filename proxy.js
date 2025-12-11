import { verifyUserToken } from "./lib/userAuth.js";
import { NextResponse } from "next/server";

// Centralized proxy/middleware logic — exported so it can be reused
export function proxy(request) {
  const path = request.nextUrl.pathname;

  // Allow only the public client pages: /login and /register.
  // All other pages require authentication. OTP endpoints remain public for registration/login flows.
  const publicPrefixes = ["/login", "/register"];

  const publicApiPaths = [
    "/api/register",
    "/api/login",
    "/api/verify-otp",
    "/api/resend-otp",
  ];

  if (
    publicPrefixes.some((p) => path === p || path.startsWith(p + "/")) ||
    publicApiPaths.some((p) => path === p || path.startsWith(p + "/"))
  ) {
    return NextResponse.next();
  }

  // Allow Next.js internals and static assets
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/public") ||
    path.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Check authentication cookie
  const cookie = request.cookies.get?.("userToken")?.value ?? null;

  if (!cookie) {
    if (path.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/register", request.url));
  }

  const payload = verifyUserToken(cookie);
  if (!payload) {
    if (path.startsWith("/api")) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/register", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
