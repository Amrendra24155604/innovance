import { NextResponse } from "next/server";
import { dbConnect } from "../../../../dbConfig/dbConfig.js";
import User from "../../../../models/users.models.js";

export async function POST(req) {
  try {
    await dbConnect();
    const { hexcode } = await req.json();

    if (!hexcode) {
      return NextResponse.json({ error: "hexcode required" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { hexcode },
      { $set: { idCard: true } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Hexcode not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        idCard: true,
        foodpacket: user.foodpacket || false,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("mark-idcard error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
