// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../dbConfig/dbConfig.js";
import User from "../../../../models/users.models.js";
import { verifyAdminToken } from "../../../../lib/adminAuth.js";

export async function GET(req) {
  try {
    const token = req.cookies.get?.("admin_token")?.value ?? null;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const users = await User.find({})
      .select("rollNumber firstName lastName kiitEmail branch year paymentScreenshot isPaymentSuccessful createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("Admin get users error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
  }
}
