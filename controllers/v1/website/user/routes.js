import express from "express";
const app = express();
import { adminLogin, createCandidate, sendOtp, verifyOtp } from "./user.js";

app.post("/adminLogin", adminLogin);
app.post("/createCandidate", createCandidate);
app.post("/candidate/sendOtp", sendOtp);
app.post("/candidate/verifyOtp", verifyOtp);
export default app;
