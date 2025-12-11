import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";
import { sendOtpEmail, generateOTP } from "../../../lib/mail.js";
import crypto from "crypto";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Construct fullName (last name first)
    const fullName = body.lastName && body.firstName
      ? `${body.lastName} ${body.firstName}`
      : body.fullName || ""; // fallback if frontend already sends fullName

    const payload = {
      ...body,
      fullName, // ensure fullName is always set
      year: Number(body.year),
      kiitEmail: `${body.rollNumber}@kiit.ac.in`,
    };

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Generate session ID
    const sessionId = crypto.randomBytes(16).toString("hex");
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    const user = new User({
      ...payload,
      otp,
      otpExpiry,
      sessionId,
      sessionExpiry,
    });

    try {
      await user.save();
    } catch (err) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "field";
        return NextResponse.json(
          { error: `Duplicate ${field}. Please use a different ${field}.` },
          { status: 400 }
        );
      }
      throw err;
    }

    try {
      await sendOtpEmail(user.kiitEmail, otp);
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration initiated. OTP sent to your email.",
        rollNumber: user.rollNumber,
        sessionId, // send to frontend
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/register:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register" },
      { status: 500 }
    );
  }
}