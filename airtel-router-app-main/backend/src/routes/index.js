import { Router } from "express";

import adminRouter from "./admin.js";

import { storeStageOneData } from "../controllers/general/store-stage-one-data.js";
import { storeStageTwoData } from "../controllers/general/store-stage-two-data.js";
import { storeStageThreeData } from "../controllers/general/store-stage-three-data.js";
import { storeStageFourData } from "../controllers/general/store-stage-four-data.js";
import { storeStageFiveData } from "../controllers/general/store-stage-five-data.js";

const router = Router();

router.use("/admin", adminRouter);

router.post("/stage-01", storeStageOneData);
router.post("/stage-02", storeStageTwoData);
router.post("/stage-03", storeStageThreeData);
router.post("/stage-04", storeStageFourData);
router.post("/stage-05", storeStageFiveData);

export default router;
