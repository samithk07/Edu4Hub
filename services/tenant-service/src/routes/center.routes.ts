import { Router } from "express";

import {
  createCenterController,
  deleteCenterController,
  getAllCentersController,
  getCenterByIdController,
  updateCenterController,
} from "../controllers/center.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  authorize,
} from "../middleware/rbac.middleware";

const router = Router();

router.use(authenticate);

router.use(authorize("SUPER_ADMIN"));

router.post("/", createCenterController);

router.get("/", getAllCentersController);


router.get("/:id", getCenterByIdController);

router.patch("/:id", updateCenterController);

router.delete("/:id", deleteCenterController);

export default router;