"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCenterSchema = exports.createCenterSchema = void 0;
const zod_1 = require("zod");
exports.createCenterSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Center name must be at least 2 characters")
        .max(150)
        .trim(),
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .max(150)
        .trim()
        .toLowerCase(),
    phone: zod_1.z
        .string()
        .max(20)
        .trim()
        .optional(),
    address: zod_1.z
        .string()
        .max(500)
        .trim()
        .optional(),
});
exports.updateCenterSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2)
        .max(150)
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .max(150)
        .trim()
        .toLowerCase()
        .optional(),
    phone: zod_1.z
        .string()
        .max(20)
        .trim()
        .optional(),
    address: zod_1.z
        .string()
        .max(500)
        .trim()
        .optional(),
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
});
