import express, { Router } from "express";
const router = express.Router();

import attempt from "./attempt/routes.js";
import user from "./user/routes.js";

router.use("/attempt", attempt);
router.use("/user", user);

export default router;
