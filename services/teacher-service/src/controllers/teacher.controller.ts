import { Request, Response } from "express";

import {
  createTeacherService,
  deleteTeacherService,
  getAllTeachersService,
  getTeacherByIdService,
  updateTeacherService,
} from "../services/teacher.service";

import {
  createTeacherSchema,
  updateTeacherSchema,
} from "../validators/teacher.validator";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const getCenterScope = (
  req: AuthenticatedRequest
): number | undefined => {
  if (req.user?.role === "CENTER_ADMIN") {
    return req.user.centerId ?? undefined;
  }

  return undefined;
};

export const createTeacherController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = createTeacherSchema.safeParse(
      req.body
    );

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
    if (
      req.user.role === "CENTER_ADMIN" &&
      req.user.centerId !== input.centerId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only create teachers in your own center",
      });
    }

    const teacher = await createTeacherService(input);

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create teacher";

    if (
      message ===
      "A teacher with this email already exists"
    ) {
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

export const getAllTeachersController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const centerId = getCenterScope(req);

    const teachers =
      await getAllTeachersService(centerId);

    return res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Get teachers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
    });
  }
};

export const getTeacherByIdController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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

    const teacher =
      await getTeacherByIdService(id, centerId);

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
  } catch (error) {
    console.error("Get teacher error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch teacher",
    });
  }
};

export const updateTeacherController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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

    const result = updateTeacherSchema.safeParse(
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const centerId = getCenterScope(req);

    const teacher =
      await updateTeacherService(
        id,
        result.data,
        centerId
      );

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
  } catch (error) {
    console.error("Update teacher error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update teacher",
    });
  }
};

export const deleteTeacherController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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

    const teacher =
      await deleteTeacherService(id, centerId);

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
  } catch (error) {
    console.error("Delete teacher error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate teacher",
    });
  }
};