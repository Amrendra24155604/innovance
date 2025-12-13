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
      branch,
      year,
      phoneNumber,
      whatsappNumber,
      kiitEmail,
    } = body;

    // basic validation (no rollNumber here)
    if (!fullName || !branch || !year || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const finalEmail = kiitEmail || email;
    if (!finalEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ kiitEmail: finalEmail });

    if (!user) {
      // create new user with rollNumber extracted from email
      const rollNumber = finalEmail.split("@")[0];
      user = new User({
        kiitEmail: finalEmail,
        rollNumber,
        fullName,
        branch,
        year: Number(year),
        phoneNumber,
        whatsappNumber,
        isRegistered: true,
      });
    } else {
      // update other fields but do not overwrite rollNumber
      user.fullName = fullName;
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