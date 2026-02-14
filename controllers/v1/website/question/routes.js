import express from "express";
const app = express();
import { createAdminQuestion, getAllAdminQuestions, updateQuestion, deleteQuestion, getCandidateQuestions } from "./question.js";
import { authenticate } from "../../../../model/helpers/authenticateToken.js";



app.post("/admin/createAdminQuestions", authenticate, createAdminQuestion);
app.get("/admin/getAllAdminQuestions", authenticate, getAllAdminQuestions);
app.put("/admin/updateQuestion/:questionId", authenticate, updateQuestion);
app.delete("/admin/deleteQuestion/:questionId", authenticate, deleteQuestion);

// Candidate
app.get("/candidate/getCandidateQuestions", authenticate, getCandidateQuestions);
export default app;
