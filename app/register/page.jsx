"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    branch: "",
    year: "",
    phoneNumber: "",
    whatsappNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const expectedEmail = `${formData.rollNumber}@kiit.ac.in`;
    if (formData.email !== expectedEmail) {
      alert("Email must be your roll number followed by @kiit.ac.in (e.g., 12345678@kiit.ac.in)");
      return;
    }

    const payload = {
      ...formData,
      kiitEmail: expectedEmail,     
    };

    try {

      const response = await axios.post('/api/register', payload);

      const data = response.data;

      if (response.status === 200) {
        const roll = data?.rollNumber || formData.rollNumber;
        router.push(`/verify-otp?roll=${encodeURIComponent(roll)}`);
      } else {
        alert((data && data.error) || `Request failed with status ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Student Registration
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Fill in your details to join <span className="font-semibold">Innovance 4.0</span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Roll Number */}
          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Kiit Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Branch & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">Select Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Phone Number */}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* WhatsApp Number */}
          <input
            type="text"
            name="whatsappNumber"
            placeholder="WhatsApp Number"
            value={formData.whatsappNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <Link href="/login" className="text-sm text-gray-600">
            Already have an account? Login
          </Link>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-l-to-r from-blue-600 to-purple-600 text-white font-semibold p-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}