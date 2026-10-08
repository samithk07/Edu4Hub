"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentSchema = exports.createStudentSchema = void 0;
const zod_1 = require("zod");
exports.createStudentSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2)
        .max(150)
        .trim(),
    email: zod_1.z
        .string()
        .email()
        .max(150)
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(8)
        .max(100),
    centerId: zod_1.z
        .number()
        .int()
        .positive(),
    phone: zod_1.z
        .string()
        .max(20)
        .trim()
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .optional(),
    gender: zod_1.z
        .string()
        .max(20)
        .trim()
        .optional(),
    address: zod_1.z
        .string()
        .max(500)
        .trim()
        .optional(),
    admissionNumber: zod_1.z
        .string()
        .min(1)
        .max(50)
        .trim(),
});
exports.updateStudentSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2)
        .max(150)
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .email()
        .max(150)
        .trim()
        .toLowerCase()
        .optional(),
    phone: zod_1.z
        .string()
        .max(20)
        .trim()
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .optional(),
    gender: zod_1.z
        .string()
        .max(20)
        .trim()
        .optional(),
    address: zod_1.z
        .string()
        .max(500)
        .trim()
        .optional(),
    admissionNumber: zod_1.z
        .string()
        .min(1)
        .max(50)
        .trim()
        .optional(),
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
});
