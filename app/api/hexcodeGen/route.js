import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";
import crypto from "crypto";

function generateHexcode(length = 12) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

export async function POST(req) {
  try {
    await dbConnect();
    const { participantId } = await req.json(); // rollNumber or kiitEmail etc.

    if (!participantId) {
      return NextResponse.json(
        { error: "participantId is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ rollNumber: participantId });

    if (!user) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (!user.isRegistered) {
      return NextResponse.json(
        { error: "Participant is not registered yet" },
        { status: 400 }
      );
    }


    if (user.hexcode) {
      return NextResponse.json(
        { hexcode: user.hexcode, alreadyGenerated: true },
        { status: 200 }
      );
    }

    // Generate new hexcode
    const hexcode = generateHexcode(12);

    user.hexcode = hexcode;
    await user.save();

    return NextResponse.json(
      {
        hexcode,
        alreadyGenerated: false,
        participant: {
          fullName: user.fullName,
          rollNumber: user.rollNumber,
          kiitEmail: user.kiitEmail,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("generate-hexcode error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
