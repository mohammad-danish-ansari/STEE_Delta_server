import mongoose from "mongoose";
import OPTIONS from "../config/Options.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: false,
      lowercase: true,
      unique: false,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: OPTIONS.role.getAllStatus(),
      default: OPTIONS.role.CANDIDATE,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "User",
  },
);

UserSchema.methods.genToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    },
  );
};
const User = mongoose.model("User", UserSchema);
export default User;
