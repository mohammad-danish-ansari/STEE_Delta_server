import mongoose from "mongoose";
import OPTIONS from "../config/Options";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
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
    CONSTANTS.key,
    {
      expiresIn: "1h",
    },
  );
};
const User = mongoose.model("User", UserSchema);
export default User;
