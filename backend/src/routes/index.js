import { Router } from "express";
import adminRouter from "./admin.js";
import { storeStageOneData } from "../controllers/general/store-stage-one-data.js";
import { storeStageTwoData } from "../controllers/general/store-stage-two-data.js";
import { getDeviceDetails } from "../controllers/general/get-data.js";
import { printUIDLabel } from "../controllers/general/print-UID.js";
import { printStage03label } from "../controllers/general/print-stage3-label.js";
import { printStage04label } from "../controllers/general/print-stage4-label.js";
import { printMasterLabel } from "../controllers/general/print-master-label.js";

const router = Router()

router.use("/admin", adminRouter)
router.post("/stage-01", storeStageOneData)
router.post("/stage-02", storeStageTwoData)
router.post("/print-UID-label", printUIDLabel);
router.post("/print-stage03-label", printStage03label);
router.post("/print-stage04-label", printStage04label);
router.get("/device/:uid", getDeviceDetails);
router.post("/print-master-label", printMasterLabel)

export default router