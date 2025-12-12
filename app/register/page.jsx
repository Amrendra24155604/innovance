"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    hostel: "",
    email: "",
  });
  const [sameAsPhone, setSameAsPhone] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSameAsPhone(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, whatsappNumber: prev.phoneNumber }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = `${formData.lastName} ${formData.firstName}`;
    const payload = {
      ...formData,
      fullName,
      kiitEmail: `${formData.rollNumber}@kiit.ac.in`,
    };

    try {
      const response = await axios.post("/api/register", payload);
      const data = response.data;

      if (response.status === 200) {
        router.push("/"); // go to home page after successful register
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

          {/* Hostel */}
          <input
            type="text"
            name="hostel"
            placeholder="Hostel Name/Number"
            value={formData.hostel}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Phone Number */}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => {
              handleChange(e);
              if (sameAsPhone) {
                setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }));
              }
            }}
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
            disabled={sameAsPhone}
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sameAsPhone"
              checked={sameAsPhone}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sameAsPhone" className="text-gray-700 dark:text-gray-300">
              WhatsApp number same as Phone number
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold p-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already registered?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Login instead
          </button>
        </p>
      </div>
    </div>
  );
}