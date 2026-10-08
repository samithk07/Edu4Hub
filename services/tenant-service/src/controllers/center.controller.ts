import { Request, Response } from "express";

import {
  createCenterService,
  deleteCenterService,
  getAllCentersService,
  getCenterByIdService,
  updateCenterService,
} from "../services/center.service";

import {
  createCenterSchema,
  updateCenterSchema,
} from "../validators/center.validator";

export const createCenterController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = createCenterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const center = await createCenterService(result.data);

    return res.status(201).json({
      success: true,
      message: "Center created successfully",
      data: center,
    });
  } catch (error) {
    console.error("Create center error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create center",
    });
  }
};

export const getAllCentersController = async (
  _req: Request,
  res: Response
) => {
  try {
    const centers = await getAllCentersService();

    return res.status(200).json({
      success: true,
      data: centers,
    });
  } catch (error) {
    console.error("Get centers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch centers",
    });
  }
};

export const getCenterByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid center ID",
      });
    }

    const center = await getCenterByIdService(id);

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
  } catch (error) {
    console.error("Get center error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch center",
    });
  }
};

export const updateCenterController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid center ID",
      });
    }

    const result = updateCenterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const center = await updateCenterService(
      id,
      result.data
    );

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
  } catch (error) {
    console.error("Update center error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update center",
    });
  }
};

export const deleteCenterController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid center ID",
      });
    }

    const center = await deleteCenterService(id);

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
  } catch (error) {
    console.error("Delete center error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate center",
    });
  }
};