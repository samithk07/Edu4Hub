"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const loginController = async (req, res) => {
    try {
        // Validate request body
        const result = auth_validator_1.loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        // Authenticate user
        const authResult = await (0, auth_service_1.login)(result.data);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: authResult,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Authentication failed";
        if (message === "Invalid email or password" ||
            message === "User account is inactive") {
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
exports.loginController = loginController;
