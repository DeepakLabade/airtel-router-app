import { Router } from "express";
import adminRouter from "./admin.js";
import { storeStageOneData } from "../controllers/general/store-stage-one-data.js";
import { storeStageTwoData } from "../controllers/general/store-stage-two-data.js";
import { getDeviceDetails } from "../controllers/general/get-data.js";

const router = Router()

router.use("/admin", adminRouter)
router.post("/stage-01", storeStageOneData)
router.post("/stage-02", storeStageTwoData)
router.get("/device/:uid", getDeviceDetails);

export default router