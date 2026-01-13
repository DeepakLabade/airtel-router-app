import { Router } from "express";
import adminRouter from "./admin.js";
import { storeStageOneData } from "../controllers/general/store-stage-one-data.js";
import { storeStageTwoData } from "../controllers/general/store-stage-two-data.js";

const router = Router()

router.use("/admin", adminRouter)
router.post("/stage-01", storeStageOneData)
router.post("/stage-02", storeStageTwoData)

export default router