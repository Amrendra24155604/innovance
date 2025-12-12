"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    // ✅ Fetch user details from backend API
    async function fetchUserDetails() {
      try {
        const res = await fetch(`/api/user/by-email?email=${encodeURIComponent(user.kiitEmail)}`);
        const data = await res.json();

        if (res.ok) {
          setIsRegistered(data.isRegistered ?? true); // user exists
          setUpiId(data.upiId || "");
          setPaymentScreenshot(data.screenshotUrl || null);
          setIsPaymentSuccessful(data.isPaymentSuccessful || false);
        } else {
          console.error("Error fetching user:", data.error);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchUserDetails();
  }, [router]);

  // ✅ Logic for button rendering
  const canGoToConfirmation =
    isRegistered && isPaymentSuccessful; // only when admin approves

  const hasPaymentDetails =
    isRegistered && (upiId !== "" || paymentScreenshot !== null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-8">
      <header className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-wide">INNOVANCE 4.0</h1>
        <h2 className="text-2xl font-semibold">By IoT Labs</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-200">
          Join us for the ultimate innovation fest — where technology,
          creativity, and collaboration meet.
        </p>
      </header>

      <div className="mt-10 flex space-x-6">
        {!isRegistered ? (
          <a
            href="/register"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition transform hover:scale-105"
          >
            Register Now
          </a>
        ) : canGoToConfirmation ? (
          <a
            href="/confirmation"
            className="bg-blue-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition transform hover:scale-105"
          >
            Go to Confirmation
          </a>
        ) : hasPaymentDetails ? (
          <a
            href="/payment"
            className="bg-green-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition transform hover:scale-105"
          >
            Continue to Payment (Awaiting Approval)
          </a>
        ) : (
          <a
            href="/payment"
            className="bg-green-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition transform hover:scale-105"
          >
            Continue to Payment
          </a>
        )}

        <a
          href="/about"
          className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105"
        >
          Learn More
        </a>
      </div>

      <footer className="mt-20 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} IoT Labs. All rights reserved.
      </footer>
    </div>
  );
}