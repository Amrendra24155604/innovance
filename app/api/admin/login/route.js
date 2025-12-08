// app/api/admin/login/route.js
// app/api/admin/login/route.js (server)
import { NextResponse } from "next/server";
import { signAdminToken } from "../../../../lib/adminAuth.js";

export async function POST(req) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = signAdminToken({ role: "admin" });
  const res = NextResponse.json({ message: "Logged in" }, { status: 200 });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Number(process.env.ADMIN_JWT_EXPIRES_IN) || 3600
  });
  return res;
}

import { verifyAdminToken } from "../../../../lib/adminAuth.js";

function getAdminFromRequest(req) {
  // req.cookies.get is available on NextRequest in App Router route handlers
  const cookie = req.cookies.get?.("admin_token")?.value ?? null;
  if (!cookie) return null;
  return verifyAdminToken(cookie);
}
