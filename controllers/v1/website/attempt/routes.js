import express from "express";
const app = express();
import { startAttempt, getRemainingTime, submitAttempt, getAllAttemptResult, deleteAttemptByAdmin } from "./attempt.js";
import { authenticate } from "./../../../../model/helpers/authenticateToken.js";

app.post("/candidate/startAssessment", authenticate, startAttempt);
app.get("/candidate/:attemptId/timer", authenticate, getRemainingTime);

app.post("/candidate/:attemptId/submit", authenticate, submitAttempt);
app.get("/candidate/getAllAttemptResult",authenticate,  getAllAttemptResult);

app.delete(
    "/admin/attempt/:attemptId",
    authenticate,
    deleteAttemptByAdmin
  );
export default app;
