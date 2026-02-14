import express, { Router } from "express";
const router = express.Router();

import attempt from "./attempt/routes.js";
import user from "./user/routes.js";
import question from "./question/routes.js";

router.use("/attempt", attempt);
router.use("/user", user);
router.use("/question", question);

export default router;
