import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";
import { sendOtpEmail, generateOTP } from "../../../lib/mail.js";

export async function POST(req) {
  try {
    await dbConnect();

    const { rollNumber } = await req.json();
    if (!rollNumber) {
      return NextResponse.json({ error: "rollNumber is required" }, { status: 400 });
    }

    const user = await User.findOne({ rollNumber });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    // Send email
    await sendOtpEmail(user.email, otp);

    return NextResponse.json({ message: "New OTP sent to your email" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/resend-otp:", error);
    return NextResponse.json({ error: error.message || "Failed to resend OTP" }, { status: 500 });
  }
}