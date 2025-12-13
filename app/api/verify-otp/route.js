// app/api/verify-otp/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig";
import User from "../../../models/users.models";
// app/api/verify-otp/route.js
export async function POST(req) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const kiitEmail = email.trim().toLowerCase();
    const providedOtp = String(otp).trim();

    const user = await User.findOne({ kiitEmail });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please request a new OTP." },
        { status: 404 }
      );
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.otpExpiry)) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (String(user.otp).trim() !== providedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP is valid → now finalize user data
    const rollNumber = kiitEmail.split("@")[0];

    if (!user.rollNumber) {
      user.rollNumber = rollNumber;
    }
    // You can also set defaults here if you want:
    // user.fullName = user.fullName || "";
    // user.year = user.year || 1;

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message: "OTP verified",
        kiitEmail: user.kiitEmail,
        isRegistered: user.isRegistered,
        user: {
          kiitEmail: user.kiitEmail,
          fullName: user.fullName,
          rollNumber: user.rollNumber,
          isRegistered: user.isRegistered,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
