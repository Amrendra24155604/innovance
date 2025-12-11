import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    // Find user by KIIT email
    const user = await User.findOne({ kiitEmail: email });

    // If no user or no sessionId, reject
    if (!user || !user.sessionId) {
      return NextResponse.json(
        { error: "No active session found. Please register or verify your email." },
        { status: 401 }
      );
    }

    // If sessionId exists → login success
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          fullName: user.fullName,
          rollNumber: user.rollNumber,
          branch: user.branch,
          year: user.year,
          kiitEmail: user.kiitEmail,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/login:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}