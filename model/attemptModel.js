import mongoose from "mongoose";
import OPTIONS from "../config/Options.js";

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    duration: {
      type: Number, 
      required: true,
    },

    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },

    status: {
      type: String,
      enum: OPTIONS.status.getAllStatus(),
      default: OPTIONS.status.IN_PROGRESS,
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOption: {
          type: String,
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "Attempt",
  }
);

const Attempt = mongoose.model("Attempt", attemptSchema);
export default Attempt;
