// app/api/send-otp/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";
import { sendOtpEmail, generateOTP } from "../../../lib/mail.js";

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Optionally enforce KIIT domain:
    // if (!email.endsWith("@kiit.ac.in")) { ... }

    const kiitEmail = email.trim().toLowerCase();

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert user by email: if exists, update OTP; else create
    let user = await User.findOne({ kiitEmail });

    if (!user) {
      user = new User({
        kiitEmail,
        otp,
        otpExpiry,
        isRegistered: false,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();

    // send OTP email (comment this out temporarily if debugging)
    await sendOtpEmail(kiitEmail, otp);

    return NextResponse.json(
      {
        message: "OTP sent",
        kiitEmail: user.kiitEmail,
        isRegistered: user.isRegistered ?? false,
      },
      { status: 200 }
    );
  } catch (err) {
  console.error("send-otp error RAW:", err);
  if (err?.stack) console.error(err.stack);
  return NextResponse.json(
    { error: "Failed to send OTP" },
    { status: 500 }
  );
}
}