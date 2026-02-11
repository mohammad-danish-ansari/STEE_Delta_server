import { Router } from "express";
const router = Router()

import routerV1 from "./controllers/v1/routes.js"

router.use("/v1",routerV1)
export default router