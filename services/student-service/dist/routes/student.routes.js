"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// All student routes require authentication.
router.use(auth_middleware_1.authenticate);
// Only CENTER_ADMIN can manage students.
router.post("/", (0, rbac_middleware_1.authorize)("CENTER_ADMIN"), student_controller_1.createStudentController);
router.get("/", (0, rbac_middleware_1.authorize)("CENTER_ADMIN"), student_controller_1.getAllStudentsController);
router.get("/:id", (0, rbac_middleware_1.authorize)("CENTER_ADMIN"), student_controller_1.getStudentByIdController);
router.patch("/:id", (0, rbac_middleware_1.authorize)("CENTER_ADMIN"), student_controller_1.updateStudentController);
router.delete("/:id", (0, rbac_middleware_1.authorize)("CENTER_ADMIN"), student_controller_1.deleteStudentController);
exports.default = router;
