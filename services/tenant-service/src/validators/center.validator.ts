
import { z } from "zod";

export const createCenterSchema = z.object({
  name: z
    .string()
    .min(2, "Center name must be at least 2 characters")
    .max(150)
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .max(150)
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .max(20)
    .trim()
    .optional(),

  address: z
    .string()
    .max(500)
    .trim()
    .optional(),
});

export const updateCenterSchema = z.object({
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

  address: z
    .string()
    .max(500)
    .trim()
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});

export type CreateCenterInput = z.infer<
  typeof createCenterSchema
>;

export type UpdateCenterInput = z.infer<
  typeof updateCenterSchema
>;