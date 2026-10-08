import bcrypt from "bcrypt";

import {
  createAdmin,
  deactivateAdmin,
  findAdminByEmail,
  findAdminById,
  findAllAdmins,
  updateAdmin,
} from "../repositories/admin.repository";

import type {
  CreateAdminInput,
  UpdateAdminInput,
} from "../validators/admin.validator";

export const createAdminService = async (
  input: CreateAdminInput
) => {
  const existingAdmin = await findAdminByEmail(
    input.email
  );

  if (existingAdmin) {
    throw new Error(
      "An admin with this email already exists"
    );
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    12
  );

  return createAdmin(input, passwordHash);
};

export const getAllAdminsService = async () => {
  return findAllAdmins();
};

export const getAdminByIdService = async (
  id: number
) => {
  return findAdminById(id);
};

export const updateAdminService = async (
  id: number,
  input: UpdateAdminInput
) => {
  return updateAdmin(id, input);
};

export const deleteAdminService = async (
  id: number
) => {
  return deactivateAdmin(id);
};