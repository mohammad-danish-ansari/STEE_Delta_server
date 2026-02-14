import apiRouter from "./routes.js";
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/dbconnect.js";
import cors from "cors";
import logger from "morgan";
import { superAdminInsertFun } from "./controllers/v1/website/user/user.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use("/", apiRouter);

const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const startServer = async () => {
  try {
    await connectDb(DATABASE_URL);

    await superAdminInsertFun();   

    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Server start failed", error);
  }
};

startServer();
