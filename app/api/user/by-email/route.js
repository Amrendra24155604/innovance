import User from "@/models/users.models.js";
import { dbConnect } from "@/dbConfig/dbConfig.js";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email"); // automatically decoded

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ kiitEmail: email }).lean();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isRegistered = true; // user exists
    const isPaymentSuccessful = Boolean(user.isPaymentSuccessful);
    const hasPaymentDetails = Boolean(user.upiId || user.screenshotUrl);
    const rollNumber = user.rollNumber
    return Response.json({
      isRegistered,
      isPaymentSuccessful,
      hasPaymentDetails,
      rollNumber,
      upiId: user.upiId || null,
      paymentScreenshot: user.paymentScreenshot || null,
    });
  } catch (err) {
    console.error("user by-email error:", err);
    return Response.json(
      { error: "Failed to fetch user status" },
      { status: 500 }
    );
  }
}