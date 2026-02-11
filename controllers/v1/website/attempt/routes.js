import express from "express";
const app = express();
import { startAttempt,
getRemainingTime,
submitAttempt} from "./attempt.js";



app.post("/start", startAttempt);
app.get("/:attemptId/timer", getRemainingTime);
app.post("/:attemptId/submit", submitAttempt);

export default app;
