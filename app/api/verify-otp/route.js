import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig";
import User from "../../../models/users.models";

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

    const user = await User.findOne({ kiitEmail: email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new one." },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

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
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
