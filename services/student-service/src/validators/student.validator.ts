import { z } from "zod";

export const createStudentSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(150)
    .trim(),

  email: z
    .string()
    .email()
    .max(150)
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(100),

  centerId: z
    .number()
    .int()
    .positive(),

  phone: z
    .string()
    .max(20)
    .trim()
    .optional(),

  dateOfBirth: z
    .string()
    .optional(),

  gender: z
    .string()
    .max(20)
    .trim()
    .optional(),

  address: z
    .string()
    .max(500)
    .trim()
    .optional(),

  admissionNumber: z
    .string()
    .min(1)
    .max(50)
    .trim(),
});

export const updateStudentSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(150)
    .trim()
    .optional(),

  email: z
    .string()
    .email()
    .max(150)
    .trim()
    .toLowerCase()
    .optional(),

  phone: z
    .string()
    .max(20)
    .trim()
    .optional(),

  dateOfBirth: z
    .string()
    .optional(),

  gender: z
    .string()
    .max(20)
    .trim()
    .optional(),

  address: z
    .string()
    .max(500)
    .trim()
    .optional(),

  admissionNumber: z
    .string()
    .min(1)
    .max(50)
    .trim()
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});