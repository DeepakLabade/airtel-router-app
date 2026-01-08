import { Router } from "express";
import { storeMasterForm } from "../controllers/admin/store-master-form.js";

const adminRouter = Router()

adminRouter.post("/master-form", storeMasterForm)
adminRouter.post("/stage-01", storeStageOneData)

export default adminRouter