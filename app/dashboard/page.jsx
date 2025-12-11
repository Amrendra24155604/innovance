"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Example: fetch user info from backend (adjust endpoint as needed)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me"); // create this endpoint to return logged-in user
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/login"); // redirect if not logged in
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-300 text-center mb-4">
            Innovance 4.0 Dashboard
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Welcome {user ? user.fullName : "Participant"} 🎉
          </p>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Your Details
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Roll Number:</strong> {user.rollNumber}</li>
              <li><strong>Branch:</strong> {user.branch}</li>
              <li><strong>Year:</strong> {user.year}</li>
              <li><strong>Email:</strong> {user.kiitEmail}</li>
              <li><strong>Phone:</strong> {user.phoneNumber}</li>
              <li><strong>WhatsApp:</strong> {user.whatsappNumber || "N/A"}</li>
              <li><strong>Payment Status:</strong> {user.isPaymentSuccessful ? "✅ Successful" : "❌ Pending"}</li>
              <li><strong>Registration Status:</strong> {user.isRegistered ? "✅ Registered" : "❌ Not Registered"}</li>
            </ul>
          </div>
        )}

        {/* Event Info */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Event Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Innovance 4.0 is the premier student innovation event at KIIT, bringing together
            bright minds to showcase projects, attend workshops, and network with peers.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Date: 15th–17th December 2025</li>
            <li>Venue: KIIT Campus, Bhubaneswar</li>
            <li>Workshops, Hackathons, and Guest Talks</li>
            <li>Exciting prizes and networking opportunities</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            View Events
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => router.push("/logout")}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}