"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacherController = exports.updateTeacherController = exports.getTeacherByIdController = exports.getAllTeachersController = exports.createTeacherController = void 0;
const teacher_service_1 = require("../services/teacher.service");
const teacher_validator_1 = require("../validators/teacher.validator");
const getCenterScope = (req) => {
    if (req.user?.role === "CENTER_ADMIN") {
        return req.user.centerId ?? undefined;
    }
    return undefined;
};
const createTeacherController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const result = teacher_validator_1.createTeacherSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        const input = result.data;
        // Center Admin can only create teachers
        // inside their own center.
        if (req.user.role === "CENTER_ADMIN" &&
            req.user.centerId !== input.centerId) {
            return res.status(403).json({
                success: false,
                message: "You can only create teachers in your own center",
            });
        }
        const teacher = await (0, teacher_service_1.createTeacherService)(input);
        return res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            data: teacher,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to create teacher";
        if (message ===
            "A teacher with this email already exists") {
            return res.status(409).json({
                success: false,
                message,
            });
        }
        console.error("Create teacher error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create teacher",
        });
    }
};
exports.createTeacherController = createTeacherController;
const getAllTeachersController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const centerId = getCenterScope(req);
        const teachers = await (0, teacher_service_1.getAllTeachersService)(centerId);
        return res.status(200).json({
            success: true,
            data: teachers,
        });
    }
    catch (error) {
        console.error("Get teachers error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch teachers",
        });
    }
};
exports.getAllTeachersController = getAllTeachersController;
const getTeacherByIdController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }
        const centerId = getCenterScope(req);
        const teacher = await (0, teacher_service_1.getTeacherByIdService)(id, centerId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: teacher,
        });
    }
    catch (error) {
        console.error("Get teacher error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch teacher",
        });
    }
};
exports.getTeacherByIdController = getTeacherByIdController;
const updateTeacherController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }
        const result = teacher_validator_1.updateTeacherSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        const centerId = getCenterScope(req);
        const teacher = await (0, teacher_service_1.updateTeacherService)(id, result.data, centerId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Teacher updated successfully",
            data: teacher,
        });
    }
    catch (error) {
        console.error("Update teacher error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update teacher",
        });
    }
};
exports.updateTeacherController = updateTeacherController;
const deleteTeacherController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID",
            });
        }
        const centerId = getCenterScope(req);
        const teacher = await (0, teacher_service_1.deleteTeacherService)(id, centerId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Teacher deactivated successfully",
            data: teacher,
        });
    }
    catch (error) {
        console.error("Delete teacher error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to deactivate teacher",
        });
    }
};
exports.deleteTeacherController = deleteTeacherController;
