"use client";

import { useRouter } from "next/navigation";
import {useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   useEffect(() => {
  if (typeof window === "undefined") return;

  const storedUser = localStorage.getItem("user");
  const isRegistered = localStorage.getItem("isRegistered") === "true";

  if (storedUser && isRegistered) {
    try {
      const user = JSON.parse(storedUser);

      const hasPayment =
        (user.upiId && user.upiId.trim() !== "") ||
        (user.paymentScreenshot && user.paymentScreenshot.trim() !== "");

      if (hasPayment) {
        router.replace("/confirmation");
      }
    } catch {
      // bad JSON, ignore and stay on login
    }
  }
}, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("send-otp failed:", res.status, text,res.body);
        setError("Failed to send OTP");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (typeof window !== "undefined") {
        localStorage.setItem("email", data.kiitEmail);
        localStorage.setItem("isRegistered", String(data.isRegistered));
      }

      router.push("/verify-otp");
    } catch (err) {
      console.error(err);
      setError("Error contacting server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="KIIT Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold p-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition-transform transform hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
