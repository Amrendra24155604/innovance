"use client";

import { useEffect, useState } from "react";

export default function ConfirmationPage() {
  const [email, setEmail] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) return; // or redirect to /login

    setEmail(storedEmail);

    async function fetchStatus() {
      try {
        const res = await fetch(
  `/api/user/by-email?email=${encodeURIComponent(storedEmail)}`
);
const data = await res.json();

        if (!res.ok) {
          console.error(data.error || "Failed to fetch status");
          return;
        }
        setIsPaymentSuccessful(data.isPaymentSuccessful);
      } catch (err) {
        console.error(err);
      }
    }

    fetchStatus();
    const id = setInterval(fetchStatus, 5000); // poll every 5s
    return () => clearInterval(id);
  }, []);

  const title = isPaymentSuccessful
    ? "🎉 Your Ticket is Confirmed!"
    : "Thanks for Joining!";

  const mainText = isPaymentSuccessful
    ? "Yes, your payment was successful and your ticket has been confirmed."
    : "Please wait while we confirm your ticket.";

  const subText = "You will receive a confirmation email with further instructions soon.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-8">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl px-8 py-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold mb-4">{title}</h1>

        {email && (
          <p className="text-sm text-gray-200 mb-2">
            Email: <span className="font-semibold">{email}</span>
          </p>
        )}

        <p className="text-lg text-gray-200 mb-4">{mainText}</p>
        <p className="text-sm text-gray-300 mb-6">{subText}</p>

        <div className="mt-4 text-xs text-gray-300">
          {email && isPaymentSuccessful === false && "Checking payment status..."}
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="inline-block bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105"
          >
            Back to Home
          </a>
        </div>
      </div>

      <footer className="mt-10 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} IoT Labs. All rights reserved.
      </footer>
    </div>
  );
}
