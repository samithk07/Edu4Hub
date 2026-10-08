"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminSchema = exports.createAdminSchema = void 0;
const zod_1 = require("zod");
exports.createAdminSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(150)
        .trim(),
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .max(150)
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100),
    centerId: zod_1.z
        .number()
        .int()
        .positive("Invalid center ID"),
});
exports.updateAdminSchema = zod_1.z.object({
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
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
    centerId: zod_1.z
        .number()
        .int()
        .positive()
        .optional(),
});
