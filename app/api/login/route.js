import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";
import { sendOtpEmail, generateOTP } from "../../../lib/mail.js";

export async function POST(req) {
  try {
    await dbConnect();

    const { rollNumber } = await req.json();

    if (!rollNumber) {
      return NextResponse.json(
        { error: "rollNumber is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ rollNumber });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isRegistered) {
      return NextResponse.json(
        { error: "User not registered. Please complete registration." },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    // Send OTP email (to kiitEmail)
    try {
      await sendOtpEmail(user.kiitEmail, otp);
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    // Return a success and hint the frontend where to go next
    
    return NextResponse.json(
      {
        message: "Login initiated. OTP sent to your email.",
        rollNumber: user.rollNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/login:", error);
    return NextResponse.json(
      { error: error.message || "Failed to login" },
      { status: 500 }
    );
  }
}
