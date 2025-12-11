"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    rollNumber: "",
    email: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Email format validation
    const expectedEmail = `${formData.rollNumber}@kiit.ac.in`;
    if (formData.email !== expectedEmail) {
      alert("Email must be rollNumber@kiit.ac.in");
      return;
    }

    try {
      const response = await axios.post("/api/login", formData);

      if (response.status === 200) {
        alert("OTP sent to your email!");
        setShowOtpSection(true); // show OTP input now
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/api/verify-otp",
        {
          rollNumber: formData.rollNumber,
          otp,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("Login successful!");
        router.push("/dashboard"); // redirect
      } else {
        console.warn("verify-otp non-200 response", res);
        alert(res.data?.error || `Request failed (${res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10">

        <h2 className="text-3xl font-extrabold text-center mb-6">
          Student Login
        </h2>

        {/* Step 1: Email Form */}
        {!showOtpSection && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="KIIT Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <p className="text-sm text-gray-600">
              <Link href="/register">Back to Register</Link>
            </p>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {showOtpSection && (
          <form onSubmit={handleOtpSubmit} className="space-y-5 mt-6">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
