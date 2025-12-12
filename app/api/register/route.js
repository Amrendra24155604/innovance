// app/api/register/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig";
import User from "../../../models/users.models";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      fullName,
      rollNumber,
      branch,
      year,
      phoneNumber,
      whatsappNumber,
      email,
      kiitEmail, // if you send it
    } = body;

    // basic validation
    if (!fullName || !rollNumber || !branch || !year || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status:400 }
      );
    }

    const finalEmail = kiitEmail || email;
    if (!finalEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // find existing user created at OTP step
    let user = await User.findOne({ kiitEmail: finalEmail });

    if (!user) {
      // if not present, create new
      user = new User({
        kiitEmail: finalEmail,
        fullName,
        rollNumber,
        branch,
        year: Number(year),
        phoneNumber,
        whatsappNumber,
        isRegistered: true,
      });
    } else {
      user.fullName = fullName;
      user.rollNumber = rollNumber;
      user.branch = branch;
      user.year = Number(year);
      user.phoneNumber = phoneNumber;
      user.whatsappNumber = whatsappNumber;
      user.isRegistered = true;
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Registered",
        user: {
          kiitEmail: user.kiitEmail,
          fullName: user.fullName,
          rollNumber: user.rollNumber,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
