"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminController = exports.updateAdminController = exports.getAdminByIdController = exports.getAllAdminsController = exports.createAdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const admin_validator_1 = require("../validators/admin.validator");
const createAdminController = async (req, res) => {
    try {
        const result = admin_validator_1.createAdminSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        const admin = await (0, admin_service_1.createAdminService)(result.data);
        return res.status(201).json({
            success: true,
            message: "Center Admin created successfully",
            data: admin,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to create admin";
        if (message ===
            "An admin with this email already exists") {
            return res.status(409).json({
                success: false,
                message,
            });
        }
        console.error("Create admin error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create admin",
        });
    }
};
exports.createAdminController = createAdminController;
const getAllAdminsController = async (_req, res) => {
    try {
        const admins = await (0, admin_service_1.getAllAdminsService)();
        return res.status(200).json({
            success: true,
            data: admins,
        });
    }
    catch (error) {
        console.error("Get admins error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
        });
    }
};
exports.getAllAdminsController = getAllAdminsController;
const getAdminByIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid admin ID",
            });
        }
        const admin = await (0, admin_service_1.getAdminByIdService)(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: admin,
        });
    }
    catch (error) {
        console.error("Get admin error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin",
        });
    }
};
exports.getAdminByIdController = getAdminByIdController;
const updateAdminController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid admin ID",
            });
        }
        const result = admin_validator_1.updateAdminSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        const admin = await (0, admin_service_1.updateAdminService)(id, result.data);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Update admin error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update admin",
        });
    }
};
exports.updateAdminController = updateAdminController;
const deleteAdminController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid admin ID",
            });
        }
        const admin = await (0, admin_service_1.deleteAdminService)(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Admin deactivated successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Delete admin error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to deactivate admin",
        });
    }
};
exports.deleteAdminController = deleteAdminController;
