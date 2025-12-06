"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [upiId, setUpiId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [rollNumber, setRollNumber] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please complete registration first.");
      router.push("/register");
    } else {
      setRollNumber(user.rollNumber);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("rollNumber", rollNumber);
    formData.append("upiId", upiId);
    if (screenshot) formData.append("screenshot", screenshot);

    const res = await fetch("/api/payment-confirm", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(
        "Thank you for joining! Please wait while we confirm your payment and create your ticket."
      );
      router.push("/"); // redirect to home
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10 space-y-6 text-center">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
          Payment Page
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please pay <strong>₹199</strong> using the QR code below and upload your details.
        </p>

        {/* Cloudinary QR Image */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              UPI QR
            </h3>
            <img
              src="https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/upi_qr.png"
              alt="UPI QR"
              className="mx-auto w-64 h-64 object-contain border rounded-lg shadow"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-6 text-left">
          <input
            type="text"
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
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