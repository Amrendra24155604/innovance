import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    kiitEmail: {
      type: String,
      required: true,
      unique: true,
    //   match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
    },
    whatsappNumber: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid WhatsApp number"],
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    branch: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Electronics",
        "Electrical",
        "Mechanical",
        "Civil",
        "Biotechnology",
        "Other",
      ], 
    },
    year: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4], 
    },
    isPaymentSuccessful: {
      type: Boolean,
      default: false,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    upiId: {
      type: String,
      trim: true,
    },
    paymentScreenshot: {
      type: String, 
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    approvedBy: { type: String },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);
//unique id 

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;