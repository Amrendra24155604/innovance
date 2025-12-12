"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [upiId, setUpiId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [rollNumber, setRollNumber] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [troubleshootMode, setTroubleshootMode] = useState(false);
  const [troubleshootImage, setTroubleshootImage] = useState(null);

  const qrImages = [
    "/qrs/first.png",
    "/qrs/second.png",
    "/qrs/third.png",
    "/qrs/fourth.png",
    "/qrs/fifth.png",
  ];

  const troubleshootImages = [
    "/troubleshoot/tone.png",
    "/troubleshoot/ttwo.png",
    "/troubleshoot/tthree.png",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;

    if (!user) {
      alert("Please complete registration first.");
      router.push("/register");
      return;
    }

    setRollNumber(user.rollNumber || "");

    // normal QR
    let index = parseInt(localStorage.getItem("qrIndex") || "0", 10);
    setQrImage(qrImages[index]);
    const nextIndex = (index + 1) % qrImages.length;
    localStorage.setItem("qrIndex", nextIndex.toString());

    // troubleshoot QR
    let tIndex = parseInt(localStorage.getItem("troubleshootIndex") || "0", 10);
    setTroubleshootImage(troubleshootImages[tIndex]);
    localStorage.setItem(
      "troubleshootIndex",
      ((tIndex + 1) % troubleshootImages.length).toString()
    );
  }, [router]);

  const handleTroubleshootClick = () => {
    setTroubleshootMode(true);
    let tIndex = parseInt(localStorage.getItem("troubleshootIndex") || "0", 10);
    setTroubleshootImage(troubleshootImages[tIndex]);
    const nextTIndex = (tIndex + 1) % troubleshootImages.length;
    localStorage.setItem("troubleshootIndex", nextTIndex.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    const email = user?.kiitEmail;
    const userId = user?._id; // IMPORTANT: make sure you stored this at login/register

    if (!email && !userId) {
      alert("User data missing. Please login again.");
      router.push("/login");
      return;
    }

    if (!upiId && !screenshot) {
      alert("Please enter UPI ID or upload a screenshot.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("userId", userId);
    if (upiId) formData.append("upiId", upiId);
    if (screenshot) formData.append("screenshot", screenshot);

    const res = await fetch("/api/payment-confirm", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      // optional: update localStorage user with upiId/screenshot
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          upiId: upiId || user.upiId,
          paymentScreenshot: data.paymentScreenshot || user.paymentScreenshot,
        })
      );

      alert(
        "Thank you for joining! Please wait while we confirm your payment and create your ticket."
      );

      // redirect to confirmation with userId
      router.push(`/confirmation?userId=${encodeURIComponent(userId)}`);
    } else {
      alert(data.error || "Payment submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
          Payment Page
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Please pay ₹199 using the QR code below and upload your details.
        </p>

        {/* QR */}
        <h3 className="text-center font-semibold mb-3">
          {troubleshootMode ? "Troubleshoot QR" : "UPI QR"}
        </h3>
        {(troubleshootMode ? troubleshootImage : qrImage) && (
          <img
            src={troubleshootMode ? troubleshootImage : qrImage}
            alt="UPI QR"
            className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md object-contain border-4 border-blue-500 rounded-xl shadow-lg transition-transform transform hover:scale-105 mb-4"
          />
        )}

        <button
          type="button"
          onClick={handleTroubleshootClick}
          className="w-full bg-red-600 text-white font-semibold p-3 rounded-lg shadow hover:bg-red-700 transition-transform transform hover:scale-105 mb-6"
        >
          Show Troubleshoot QR
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your UPI ID (optional)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files[0])}
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold p-3 rounded-lg shadow hover:from-green-700 hover:to-teal-700 transition-transform transform hover:scale-105"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
}
