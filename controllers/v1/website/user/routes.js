import express from "express";
const app = express();
import { adminLogin, createCandidate, getAdminProfile, sendOtp, verifyOtp, getAllCandidates, getCandidateProfile, updateUserByAdmin, deleteUserByAdmin } from "./user.js";
import { authenticate } from "../../../../model/helpers/authenticateToken.js";

app.post("/adminLogin", adminLogin);
app.post("/createCandidate", createCandidate);
app.get("/getAdminProfile", authenticate, getAdminProfile);
app.post("/candidate/sendOtp", sendOtp);
app.post("/candidate/verifyOtp", verifyOtp);
app.get(
  "/admin/candidates",
  authenticate,
  getAllCandidates
);
app.get(
  "/candidate/profile",
  authenticate,
  getCandidateProfile
);
app.put(
  "/admin/updateUserByAdmin/:userId",
  updateUserByAdmin
);
app.delete(
  "/admin/deleteUserByAdmin/:userId",
  deleteUserByAdmin
);
export default app;
