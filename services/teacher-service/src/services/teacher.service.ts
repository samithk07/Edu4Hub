import bcrypt from "bcrypt";

import {
  createTeacherProfile,
  createTeacherUser,
  deactivateTeacher,
  findTeacherByEmail,
  findTeacherById,
  findAllTeachers,
  updateTeacher,
} from "../repositories/teacher.repository";

import type {
  CreateTeacherInput,
  UpdateTeacherInput,
} from "../validators/teacher.validator";

export const createTeacherService = async (
  input: CreateTeacherInput
) => {
  const existingTeacher = await findTeacherByEmail(
    input.email
  );

  if (existingTeacher) {
    throw new Error(
      "A teacher with this email already exists"
    );
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    12
  );

  const userId = await createTeacherUser(
    input,
    passwordHash
  );

  const teacher = await createTeacherProfile(
    userId,
    input
  );

  if (!teacher) {
    throw new Error(
      "Failed to create teacher profile"
    );
  }

  return teacher;
};

export const getAllTeachersService = async (
  centerId?: number
) => {
  return findAllTeachers(centerId);
};

export const getTeacherByIdService = async (
  id: number,
  centerId?: number
) => {
  return findTeacherById(id, centerId);
};

export const updateTeacherService = async (
  id: number,
  input: UpdateTeacherInput,
  centerId?: number
) => {
  return updateTeacher(id, input, centerId);
};

export const deleteTeacherService = async (
  id: number,
  centerId?: number
) => {
  return deactivateTeacher(id, centerId);
};