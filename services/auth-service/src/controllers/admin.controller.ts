import { Request, Response } from "express";

import {
  createAdminService,
  deleteAdminService,
  getAdminByIdService,
  getAllAdminsService,
  updateAdminService,
} from "../services/admin.service";

import {
  createAdminSchema,
  updateAdminSchema,
} from "../validators/admin.validator";

export const createAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = createAdminSchema.safeParse(
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const admin = await createAdminService(
      result.data
    );

    return res.status(201).json({
      success: true,
      message: "Center Admin created successfully",
      data: admin,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create admin";

    if (
      message ===
      "An admin with this email already exists"
    ) {
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

export const getAllAdminsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const admins = await getAllAdminsService();

    return res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error("Get admins error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

export const getAdminByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID",
      });
    }

    const admin = await getAdminByIdService(id);

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
  } catch (error) {
    console.error("Get admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin",
    });
  }
};

export const updateAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID",
      });
    }

    const result = updateAdminSchema.safeParse(
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const admin = await updateAdminService(
      id,
      result.data
    );

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
  } catch (error) {
    console.error("Update admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update admin",
    });
  }
};

export const deleteAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID",
      });
    }

    const admin = await deleteAdminService(id);

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
  } catch (error) {
    console.error("Delete admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate admin",
    });
  }
};