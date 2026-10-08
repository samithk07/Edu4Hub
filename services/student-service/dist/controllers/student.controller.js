"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentController = exports.updateStudentController = exports.getStudentByIdController = exports.getAllStudentsController = exports.createStudentController = void 0;
const student_service_1 = require("../services/student.service");
const student_validator_1 = require("../validators/student.validator");
const getCenterScope = (req) => {
    if (req.user?.role === "CENTER_ADMIN") {
        return req.user.centerId ?? undefined;
    }
    return undefined;
};
const createStudentController = async (req, res) => {
    try {
        const validation = student_validator_1.createStudentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data",
                errors: validation.error.issues,
            });
        }
        const centerId = req.user?.centerId;
        if (!centerId) {
            return res.status(403).json({
                success: false,
                message: "Center Admin must belong to a center",
            });
        }
        if (validation.data.centerId !== centerId) {
            return res.status(403).json({
                success: false,
                message: "You cannot create a student for another center",
            });
        }
        const student = await (0, student_service_1.createStudent)({
            ...validation.data,
            centerId,
        });
        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student,
        });
    }
    catch (error) {
        console.error("Create Student Error:", error);
        const statusCode = error
            .statusCode ?? 500;
        return res.status(statusCode).json({
            success: false,
            message: statusCode === 500
                ? "Failed to create student"
                : error.message,
        });
    }
};
exports.createStudentController = createStudentController;
const getAllStudentsController = async (req, res) => {
    try {
        const centerId = getCenterScope(req);
        const students = await (0, student_service_1.getStudents)(centerId);
        return res.status(200).json({
            success: true,
            data: students,
        });
    }
    catch (error) {
        console.error("Get Students Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch students",
        });
    }
};
exports.getAllStudentsController = getAllStudentsController;
const getStudentByIdController = async (req, res) => {
    try {
        const studentId = Number(req.params.id);
        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }
        const centerId = getCenterScope(req);
        const student = await (0, student_service_1.getStudentById)(studentId, centerId);
        return res.status(200).json({
            success: true,
            data: student,
        });
    }
    catch (error) {
        console.error("Get Student Error:", error);
        const statusCode = error
            .statusCode ?? 500;
        return res.status(statusCode).json({
            success: false,
            message: statusCode === 500
                ? "Failed to fetch student"
                : error.message,
        });
    }
};
exports.getStudentByIdController = getStudentByIdController;
const updateStudentController = async (req, res) => {
    try {
        const studentId = Number(req.params.id);
        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }
        const validation = student_validator_1.updateStudentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data",
                errors: validation.error.issues,
            });
        }
        const centerId = getCenterScope(req);
        const student = await (0, student_service_1.updateStudentById)(studentId, validation.data, centerId);
        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student,
        });
    }
    catch (error) {
        console.error("Update Student Error:", error);
        const statusCode = error
            .statusCode ?? 500;
        return res.status(statusCode).json({
            success: false,
            message: statusCode === 500
                ? "Failed to update student"
                : error.message,
        });
    }
};
exports.updateStudentController = updateStudentController;
const deleteStudentController = async (req, res) => {
    try {
        const studentId = Number(req.params.id);
        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }
        const centerId = getCenterScope(req);
        const student = await (0, student_service_1.deactivateStudentById)(studentId, centerId);
        return res.status(200).json({
            success: true,
            message: "Student deactivated successfully",
            data: student,
        });
    }
    catch (error) {
        console.error("Deactivate Student Error:", error);
        const statusCode = error
            .statusCode ?? 500;
        return res.status(statusCode).json({
            success: false,
            message: statusCode === 500
                ? "Failed to deactivate student"
                : error.message,
        });
    }
};
exports.deleteStudentController = deleteStudentController;
