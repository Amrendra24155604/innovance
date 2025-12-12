"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const e = localStorage.getItem("email");
    if (!e) {
      router.replace("/login");
      return;
    }
    setEmail(e);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Step 1: Verify OTP
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("email", data.kiitEmail);
          localStorage.setItem("isRegistered", String(data.isRegistered));
          localStorage.setItem("user", JSON.stringify(data.user || {}));
        }

        if (data.isRegistered) {
          const userRes = await fetch(
            `/api/user/by-email?email=${encodeURIComponent(data.kiitEmail)}`
          );
          const userData = await userRes.json();
          console.log("UserData from API:", userData);

          if (userRes.ok) {
            const hasPayment =
              Boolean(userData.upiId) || Boolean(userData.paymentScreenshot);
            console.log("Has payment:", hasPayment);

            if (hasPayment) {
              router.push("/confirmation");
            } else {
              router.push("/payment");
            }
          } else {
            console.error("Error fetching user:", userData.error);
            router.push("/payment");
          }
        } else {
          router.push("/register");
        }
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setResendMessage("OTP resent successfully!");
      } else {
        setResendMessage(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      setResendMessage("Error contacting server");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Enter the OTP sent to <span className="font-semibold">{email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold p-3 rounded-lg shadow hover:from-green-700 hover:to-teal-700 transition-transform transform hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="mt-6 text-center">
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:opacity-60"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
          {resendMessage && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}