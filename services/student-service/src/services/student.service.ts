import bcrypt from "bcrypt";

import {
  createStudentProfile,
  createStudentUser,
  deactivateStudent,
  findAllStudents,
  findStudentByEmail,
  findStudentById,
  updateStudent,
} from "../repositories/student.repository";

interface CreateStudentInput {
  name: string;
  email: string;
  password: string;
  centerId: number;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  admissionNumber: string;
}

interface UpdateStudentInput {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  admissionNumber?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export const createStudent = async (
  data: CreateStudentInput
) => {
  const existingStudent = await findStudentByEmail(data.email);

  if (existingStudent) {
    const error = new Error("Student email already exists");
    (error as Error & { statusCode?: number }).statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const userId = await createStudentUser({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  const studentId = await createStudentProfile({
    userId,
    centerId: data.centerId,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    address: data.address,
    admissionNumber: data.admissionNumber,
  });

  return findStudentById(studentId, data.centerId);
};

export const getStudents = async (
  centerId?: number
) => {
  return findAllStudents(centerId);
};

export const getStudentById = async (
  studentId: number,
  centerId?: number
) => {
  const student = await findStudentById(
    studentId,
    centerId
  );

  if (!student) {
    const error = new Error("Student not found");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return student;
};

export const updateStudentById = async (
  studentId: number,
  data: UpdateStudentInput,
  centerId?: number
) => {
  const existingStudent = await findStudentById(
    studentId,
    centerId
  );

  if (!existingStudent) {
    const error = new Error("Student not found");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (
    data.email &&
    data.email !== existingStudent.email
  ) {
    const emailExists = await findStudentByEmail(
      data.email
    );

    if (
      emailExists &&
      emailExists.userId !== existingStudent.userId
    ) {
      const error = new Error(
        "Student email already exists"
      );

      (error as Error & { statusCode?: number }).statusCode = 409;

      throw error;
    }
  }

  return updateStudent(
    studentId,
    data,
    centerId
  );
};

export const deactivateStudentById = async (
  studentId: number,
  centerId?: number
) => {
  const existingStudent = await findStudentById(
    studentId,
    centerId
  );

  if (!existingStudent) {
    const error = new Error("Student not found");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return deactivateStudent(
    studentId,
    centerId
  );
};