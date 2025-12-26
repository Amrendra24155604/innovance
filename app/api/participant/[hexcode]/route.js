import { NextResponse } from "next/server";
import { dbConnect } from "../../../../dbConfig/dbConfig.js";
import User from "../../../../models/users.models.js";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { hexcode } = await params;

    const user = await User.findOne({ hexcode });

    // If hexcode exists we got a   participant
    return NextResponse.json(
      {
        idCard: user?.idCard || false,
        foodPacket: user?.foodpacket || false,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("check-participant error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
