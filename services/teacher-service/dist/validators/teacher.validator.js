"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeacherSchema = exports.createTeacherSchema = void 0;
const zod_1 = require("zod");
exports.createTeacherSchema = zod_1.z.object({
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
    phone: zod_1.z
        .string()
        .max(20)
        .trim()
        .optional(),
    qualification: zod_1.z
        .string()
        .max(150)
        .trim()
        .optional(),
    specialization: zod_1.z
        .string()
        .max(150)
        .trim()
        .optional(),
    experience: zod_1.z
        .string()
        .max(100)
        .trim()
        .optional(),
});
exports.updateTeacherSchema = zod_1.z.object({
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
    qualification: zod_1.z
        .string()
        .max(150)
        .trim()
        .optional(),
    specialization: zod_1.z
        .string()
        .max(150)
        .trim()
        .optional(),
    experience: zod_1.z
        .string()
        .max(100)
        .trim()
        .optional(),
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
});
