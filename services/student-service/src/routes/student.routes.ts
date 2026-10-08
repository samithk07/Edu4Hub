import { Router } from "express";

import {
  createStudentController,
  deleteStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
} from "../controllers/student.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";

const router = Router();

// All student routes require authentication.
router.use(authenticate);

// Only CENTER_ADMIN can manage students.
router.post(
  "/",
  authorize("CENTER_ADMIN"),
  createStudentController
);

router.get(
  "/",
  authorize("CENTER_ADMIN"),
  getAllStudentsController
);

router.get(
  "/:id",
  authorize("CENTER_ADMIN"),
  getStudentByIdController
);

router.patch(
  "/:id",
  authorize("CENTER_ADMIN"),
  updateStudentController
);

router.delete(
  "/:id",
  authorize("CENTER_ADMIN"),
  deleteStudentController
);

export default router;