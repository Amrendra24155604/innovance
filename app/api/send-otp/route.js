// app/api/send-otp/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";
import { sendOtpEmail, generateOTP } from "../../../lib/mail.js";
// app/api/send-otp/route.js
export async function POST(req) {
  // try {
    await dbConnect();
    const { email } = await req.json();
    const kiitEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ kiitEmail });
    console.log("User before:", user);

    // if (!user) {
    //   // NEW user: only email + otp at this point
    //   user = new User({ kiitEmail, otp, otpExpiry, isRegistered: false });
    // } else {
    //   // Existing, just update OTP
    //   user.otp = otp;
    //   user.otpExpiry = otpExpiry;
    // }

    // await user.save();
    // console.log(user);
    
    // console.log("User saved:", user._id);

    // await sendOtpEmail(kiitEmail, otp);
    // console.log("OTP email sent");

    return NextResponse.json({ message: "OTP sent", kiitEmail }, { status: 200 });
  // } catch (err) {
  //   console.error("send-otp error:", err);
  //   return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  // }
}
