import { Router } from "express";

import {
  createTeacherController,
  deleteTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherController,
} from "../controllers/teacher.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("CENTER_ADMIN"),
  createTeacherController
);

router.get(
  "/",
  authorize("CENTER_ADMIN"),
  getAllTeachersController
);

router.get(
  "/:id",
  authorize("CENTER_ADMIN"),
  getTeacherByIdController
);

router.patch(
  "/:id",
  authorize("CENTER_ADMIN"),
  updateTeacherController
);

router.delete(
  "/:id",
  authorize("CENTER_ADMIN"),
  deleteTeacherController
);
export default router;