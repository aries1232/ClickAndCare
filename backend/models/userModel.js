import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "0000000000" },
  password: { type: String, required: false }, // Not required for OAuth users
  image: {
    type: String,
    default: ""
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  resetOTP: { type: String },
  resetOTPExpiry: { type: Date },
  dob: { type: String, default: "Not Selected" },
  gender: { type: String, default: "Not Selected" },
  address: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" }
  },
  googleId: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' }
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
