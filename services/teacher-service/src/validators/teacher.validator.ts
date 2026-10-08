import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(150)
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .max(150)
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),

  centerId: z
    .number()
    .int()
    .positive("Invalid center ID"),

  phone: z
    .string()
    .max(20)
    .trim()
    .optional(),

  qualification: z
    .string()
    .max(150)
    .trim()
    .optional(),

  specialization: z
    .string()
    .max(150)
    .trim()
    .optional(),

  experience: z
    .string()
    .max(100)
    .trim()
    .optional(),
});

export const updateTeacherSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(150)
    .trim()
    .optional(),

  email: z
    .string()
    .email("Invalid email address")
    .max(150)
    .trim()
    .toLowerCase()
    .optional(),

  phone: z
    .string()
    .max(20)
    .trim()
    .optional(),

  qualification: z
    .string()
    .max(150)
    .trim()
    .optional(),

  specialization: z
    .string()
    .max(150)
    .trim()
    .optional(),

  experience: z
    .string()
    .max(100)
    .trim()
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});

export type CreateTeacherInput = z.infer<
  typeof createTeacherSchema
>;

export type UpdateTeacherInput = z.infer<
  typeof updateTeacherSchema
>;