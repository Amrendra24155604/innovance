"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rollNumber, setRollNumber] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const roll = searchParams.get("roll");
    if (roll) setRollNumber(roll);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNumber, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("OTP verified successfully!");
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/payment");
    } else {
      alert(data.error);
    }
  };

  const handleResend = async () => {
    const res = await fetch("/api/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNumber }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("New OTP sent to your email!");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Enter the OTP sent to your email to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold p-3 rounded-lg shadow hover:from-green-700 hover:to-teal-700 transition-transform transform hover:scale-105"
          >
            Verify
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold p-3 rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition-transform transform hover:scale-105"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
}