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
        const email = localStorage.getItem("email");
        if (!email) return;

        const response = await axios.get(
          `/api/user/by-email?email=${encodeURIComponent(email)}`
        );
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
    e.preventDefault();
    const email = localStorage.getItem("email");
    const fullName = `${formData.lastName} ${formData.firstName}`;

    const payload = {
      ...formData,
      fullName,
      kiitEmail: email, // backend uses this
    };

    try {
      // 1) Register user
      const response = await axios.post("/api/register", payload);

      if (response.status === 200) {
        const { user } = response.data;

        // 2) Generate hexcode only AFTER isRegistered is true
        //    You can trust backend /api/register to set isRegistered: true
        try {
          const hexRes = await axios.post("/api/hexcodeGen", {
            participantId: user.rollNumber, // or user.kiitEmail depending on backend
          });

          if (hexRes.status === 200) {
            const { hexcode } = hexRes.data;

            if (typeof window !== "undefined") {
              // store hexcode with user for later (QR, ID card, etc.)
              localStorage.setItem(
                "user",
                JSON.stringify({ ...user, hexcode })
              );
              localStorage.setItem("isRegistered", "true");
              localStorage.setItem("hexcode", hexcode);
              console.log(hexcode);
              
            }
          } else {
            console.error("Failed to generate hexcode:", hexRes.data);
          }
        } catch (hexErr) {
          console.error("Error generating hexcode:", hexErr);
          // optional: show toast but don't block registration success
        }

        // 3) Redirect after everything
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
            value={formData.rollNumber || "Loading..."}
            readOnly
            className="w-full border p-3 rounded-lg bg-gray-200 text-gray-700"
          />

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
                setFormData((prev) => ({
                  ...prev,
                  whatsappNumber: e.target.value,
                }));
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
            <label htmlFor="sameAsPhone">
              WhatsApp number same as Phone number
            </label>
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
