import { z } from "zod";

export const createAdminSchema = z.object({
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
});

export const updateAdminSchema = z.object({
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

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),

  centerId: z
    .number()
    .int()
    .positive()
    .optional(),
});

export type CreateAdminInput = z.infer<
  typeof createAdminSchema
>;

export type UpdateAdminInput = z.infer<
  typeof updateAdminSchema
>;