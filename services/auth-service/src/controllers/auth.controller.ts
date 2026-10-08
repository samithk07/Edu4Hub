import { Request, Response } from "express";

import { login } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    // Validate request body
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    // Authenticate user
    const authResult = await login(result.data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: authResult,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Authentication failed";

    if (
      message === "Invalid email or password" ||
      message === "User account is inactive"
    ) {
      return res.status(401).json({
        success: false,
        message,
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};