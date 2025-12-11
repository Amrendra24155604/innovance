import { NextResponse } from "next/server";
import { dbConnect } from "@/dbConfig/dbConfig";
import User from "@/models/users.models";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const rollNumber = searchParams.get("rollNumber");

    if (!email && !rollNumber) {
      return NextResponse.json(
        { error: "Email or Roll Number required" },
        { status: 400 }
      );
    }

    const user = email
      ? await User.findOne({ kiitEmail: email })
      : await User.findOne({ rollNumber });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          fullName: user.fullName,
          rollNumber: user.rollNumber,
          branch: user.branch,
          year: user.year,
          kiitEmail: user.kiitEmail,
          phoneNumber: user.phoneNumber,
          whatsappNumber: user.whatsappNumber,
          isPaymentSuccessful: user.isPaymentSuccessful,
          isRegistered: user.isRegistered,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/me:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}