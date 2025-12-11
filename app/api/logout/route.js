import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  // Clear the userToken cookie
  res.cookies.set("userToken", "", { path: "/", maxAge: 0 });
  return res;
}
