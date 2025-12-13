"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

  // Fetch rollNumber + email from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with actual logged-in email (could come from session)
         const email = localStorage.getItem("email");
if (!email) return;

const response = await axios.get(`/api/user/by-email?email=${encodeURIComponent(email)}`);
        if (response.status === 200) {
          const { rollNumber, kiitEmail } = response.data;
          setFormData((prev) => ({
            ...prev,
            rollNumber,
            email: kiitEmail,
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

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
const email = localStorage.getItem("email")
  e.preventDefault();
  const fullName = `${formData.lastName} ${formData.firstName}`;
  const payload = {
    ...formData,
    fullName,
    kiitEmail: email,
  };

  try {
    const response = await axios.post("/api/register", payload);

    if (response.status === 200) {
      const { user } = response.data;

      // Store user data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isRegistered", "true");
      }

      router.push("/");
    } else {
      alert(response.data.error || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting form");
  }
};

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Student Registration
        </h2>
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
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* Roll Number (disabled) */}
          <input
  type="text"
  name="rollNumber"
  placeholder="Roll Number"
  value={formData.rollNumber || "Loading..."} // fallback if empty
  readOnly
  className="w-full border p-3 rounded-lg bg-gray-200 text-gray-700"
/>

          {/* Email (disabled) */}
          {/* <input
            type="text"
            name="email"
            placeholder="KIIT Email"
            value={formData.email}
            disabled
            className="w-full border p-3 rounded-lg bg-gray-200"
          /> */}

          {/* Branch & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg w-full"
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
              className="border p-3 rounded-lg w-full"
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
            placeholder="Hostel Name"
            value={formData.hostel}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
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
            className="w-full border p-3 rounded-lg"
          />

          {/* WhatsApp Number */}
          <input
            type="text"
            name="whatsappNumber"
            placeholder="WhatsApp Number"
            value={formData.whatsappNumber}
            onChange={handleChange}
            disabled={sameAsPhone}
            className="w-full border p-3 rounded-lg"
          />

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sameAsPhone"
              checked={sameAsPhone}
              onChange={handleCheckboxChange}
              className="h-4 w-4"
            />
            <label htmlFor="sameAsPhone">WhatsApp number same as Phone number</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold p-3 rounded-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}