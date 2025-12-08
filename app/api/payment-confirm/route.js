import { NextResponse } from "next/server";
import { dbConnect } from "../../../dbConfig/dbConfig.js";
import User from "../../../models/users.models.js";
import { uploadScreenshot } from "../../../lib/cloudinary.js";
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const rollNumber = formData.get("rollNumber");
    const upiId = formData.get("upiId");
    const screenshotFile = formData.get("screenshot");

    const user = await User.findOne({ rollNumber });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let screenshotUrl = null;
    if (screenshotFile) {
      const buffer = Buffer.from(await screenshotFile.arrayBuffer());
      screenshotUrl = await uploadScreenshot(buffer);
    }

    user.upiId = upiId;
    user.paymentScreenshot = screenshotUrl;
    await user.save();

    return NextResponse.json(
      { message: "Payment submitted. Please wait while we confirm your ticket." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment confirm error:", error);
    return NextResponse.json({ error: "Failed to submit payment" }, { status: 500 });
  }
}