"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCenterController = exports.updateCenterController = exports.getCenterByIdController = exports.getAllCentersController = exports.createCenterController = void 0;
const center_service_1 = require("../services/center.service");
const center_validator_1 = require("../validators/center.validator");
const createCenterController = async (req, res) => {
    try {
        const result = center_validator_1.createCenterSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        const center = await (0, center_service_1.createCenterService)(result.data);
        return res.status(201).json({
            success: true,
            message: "Center created successfully",
            data: center,
        });
    }
    catch (error) {
        console.error("Create center error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create center",
        });
    }
};
exports.createCenterController = createCenterController;
const getAllCentersController = async (_req, res) => {
    try {
        const centers = await (0, center_service_1.getAllCentersService)();
        return res.status(200).json({
            success: true,
            data: centers,
        });
    }
    catch (error) {
        console.error("Get centers error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch centers",
        });
    }
};
exports.getAllCentersController = getAllCentersController;
const getCenterByIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid center ID",
            });
        }
        const center = await (0, center_service_1.getCenterByIdService)(id);
        if (!center) {
            return res.status(404).json({
                success: false,
                message: "Center not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: center,
        });
    }
    catch (error) {
        console.error("Get center error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch center",
        });
    }
};
exports.getCenterByIdController = getCenterByIdController;
const updateCenterController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid center ID",
            });
        }
        const result = center_validator_1.updateCenterSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        const center = await (0, center_service_1.updateCenterService)(id, result.data);
        if (!center) {
            return res.status(404).json({
                success: false,
                message: "Center not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Center updated successfully",
            data: center,
        });
    }
    catch (error) {
        console.error("Update center error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update center",
        });
    }
};
exports.updateCenterController = updateCenterController;
const deleteCenterController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid center ID",
            });
        }
        const center = await (0, center_service_1.deleteCenterService)(id);
        if (!center) {
            return res.status(404).json({
                success: false,
                message: "Center not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Center deactivated successfully",
            data: center,
        });
    }
    catch (error) {
        console.error("Delete center error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to deactivate center",
        });
    }
};
exports.deleteCenterController = deleteCenterController;
