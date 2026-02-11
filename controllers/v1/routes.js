import express from "express";

const router = express.Router();
import websiteRouter from "./website/index.js";

router.use("/website", websiteRouter);
export default router;
