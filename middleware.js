import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/register'

  if(isPublicPath){
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: "/admin/:path*",
};
