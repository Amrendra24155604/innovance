import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";

export async function POST(req) {
  try {
    await dbConnect();

    const { rollNumber, otp } = await req.json();

    if (!rollNumber || !otp) {
      return NextResponse.json(
        { error: "rollNumber and otp are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ rollNumber });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { error: "No OTP found. Please register again." },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    user.isRegistered = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

     return NextResponse.json(
    {
      message: "OTP verified successfully",
      user: {
        rollNumber: user.rollNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        kiitEmail: user.kiitEmail,
        branch: user.branch,
        year: user.year,
      },
    },
    { status: 200 }
  );

  } catch (error) {
    console.error("Error in /api/verify-otp:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}