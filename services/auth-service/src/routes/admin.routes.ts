import { Router } from "express";

import {
  createAdminController,
  deleteAdminController,
  getAdminByIdController,
  getAllAdminsController,
  updateAdminController,
} from "../controllers/admin.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN"));

router.post("/", createAdminController);

router.get("/", getAllAdminsController);

router.get("/:id", getAdminByIdController);

router.patch("/:id", updateAdminController);

router.delete("/:id", deleteAdminController);

export default router;