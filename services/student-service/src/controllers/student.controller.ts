import { Request, Response } from "express";

import {
  createStudent,
  deactivateStudentById,
  getStudentById,
  getStudents,
  updateStudentById,
} from "../services/student.service";

import {
  createStudentSchema,
  updateStudentSchema,
} from "../validators/student.validator";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    centerId: number | null;
    role: string;
  };
}

const getCenterScope = (
  req: AuthenticatedRequest
) => {
  if (req.user?.role === "CENTER_ADMIN") {
    return req.user.centerId ?? undefined;
  }

  return undefined;
};

export const createStudentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const validation =
      createStudentSchema.safeParse(req.body);

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
        message:
          "You cannot create a student for another center",
      });
    }

    const student = await createStudent({
      ...validation.data,
      centerId,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);

    const statusCode =
      (error as Error & { statusCode?: number })
        .statusCode ?? 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Failed to create student"
          : (error as Error).message,
    });
  }
};

export const getAllStudentsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const centerId = getCenterScope(req);

    const students = await getStudents(centerId);

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

export const getStudentByIdController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const centerId = getCenterScope(req);

    const student = await getStudentById(
      studentId,
      centerId
    );

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get Student Error:", error);

    const statusCode =
      (error as Error & { statusCode?: number })
        .statusCode ?? 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Failed to fetch student"
          : (error as Error).message,
    });
  }
};

export const updateStudentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const validation =
      updateStudentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validation.error.issues,
      });
    }

    const centerId = getCenterScope(req);

    const student = await updateStudentById(
      studentId,
      validation.data,
      centerId
    );

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update Student Error:", error);

    const statusCode =
      (error as Error & { statusCode?: number })
        .statusCode ?? 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Failed to update student"
          : (error as Error).message,
    });
  }
};

export const deleteStudentController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const centerId = getCenterScope(req);

    const student =
      await deactivateStudentById(
        studentId,
        centerId
      );

    return res.status(200).json({
      success: true,
      message: "Student deactivated successfully",
      data: student,
    });
  } catch (error) {
    console.error(
      "Deactivate Student Error:",
      error
    );

    const statusCode =
      (error as Error & { statusCode?: number })
        .statusCode ?? 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Failed to deactivate student"
          : (error as Error).message,
    });
  }
};