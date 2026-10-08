import { pool } from "@edu4hub/database";

import type {
  CreateTeacherInput,
  UpdateTeacherInput,
} from "../validators/teacher.validator";

export interface TeacherRecord {
  id: number;
  userId: number;
  centerId: number;
  name: string;
  email: string;
  phone: string | null;
  qualification: string | null;
  specialization: string | null;
  experience: string | null;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const findTeacherByEmail = async (
  email: string
): Promise<TeacherRecord | null> => {
  const result = await pool
    .request()
    .input("email", email)
    .query<TeacherRecord>(`
      SELECT
        t.id,
        t.userId,
        t.centerId,
        u.name,
        u.email,
        t.phone,
        t.qualification,
        t.specialization,
        t.experience,
        u.role,
        t.status,
        t.createdAt,
        t.updatedAt
      FROM teachers t
      INNER JOIN users u
        ON u.id = t.userId
      WHERE u.email = @email
        AND u.role = 'TEACHER'
    `);

  return result.recordset[0] ?? null;
};

export const createTeacherUser = async (
  input: CreateTeacherInput,
  passwordHash: string
): Promise<number> => {
  const result = await pool
    .request()
    .input("centerId", input.centerId)
    .input("name", input.name)
    .input("email", input.email)
    .input("passwordHash", passwordHash)
    .query<{ id: number }>(`
      INSERT INTO users (
        centerId,
        name,
        email,
        passwordHash,
        role,
        status
      )
      OUTPUT INSERTED.id
      VALUES (
        @centerId,
        @name,
        @email,
        @passwordHash,
        'TEACHER',
        'ACTIVE'
      )
    `);

  return result.recordset[0].id;
};

export const createTeacherProfile = async (
  userId: number,
  input: CreateTeacherInput
): Promise<TeacherRecord | null> => {
  const result = await pool
    .request()
    .input("userId", userId)
    .input("centerId", input.centerId)
    .input("phone", input.phone ?? null)
    .input("qualification", input.qualification ?? null)
    .input("specialization", input.specialization ?? null)
    .input("experience", input.experience ?? null)
    .query<TeacherRecord>(`
      INSERT INTO teachers (
        userId,
        centerId,
        phone,
        qualification,
        specialization,
        experience,
        status
      )
      OUTPUT
        INSERTED.id,
        INSERTED.userId,
        INSERTED.centerId,
        INSERTED.phone,
        INSERTED.qualification,
        INSERTED.specialization,
        INSERTED.experience,
        INSERTED.status,
        INSERTED.createdAt,
        INSERTED.updatedAt
      VALUES (
        @userId,
        @centerId,
        @phone,
        @qualification,
        @specialization,
        @experience,
        'ACTIVE'
      )
    `);

  if (!result.recordset[0]) {
    return null;
  }

  const teacher = result.recordset[0];

  return {
    ...teacher,
    name: input.name,
    email: input.email,
    role: "TEACHER",
  };
};

export const findAllTeachers = async (
  centerId?: number
): Promise<TeacherRecord[]> => {
  const request = pool.request();

  let query = `
    SELECT
      t.id,
      t.userId,
      t.centerId,
      u.name,
      u.email,
      t.phone,
      t.qualification,
      t.specialization,
      t.experience,
      u.role,
      t.status,
      t.createdAt,
      t.updatedAt
    FROM teachers t
    INNER JOIN users u
      ON u.id = t.userId
    WHERE u.role = 'TEACHER'
  `;

  if (centerId !== undefined) {
    request.input("centerId", centerId);

    query += `
      AND t.centerId = @centerId
    `;
  }

  query += `
    ORDER BY t.id DESC
  `;

  const result = await request.query<TeacherRecord>(
    query
  );

  return result.recordset;
};

export const findTeacherById = async (
  id: number,
  centerId?: number
): Promise<TeacherRecord | null> => {
  const request = pool
    .request()
    .input("id", id);

  let query = `
    SELECT
      t.id,
      t.userId,
      t.centerId,
      u.name,
      u.email,
      t.phone,
      t.qualification,
      t.specialization,
      t.experience,
      u.role,
      t.status,
      t.createdAt,
      t.updatedAt
    FROM teachers t
    INNER JOIN users u
      ON u.id = t.userId
    WHERE t.id = @id
      AND u.role = 'TEACHER'
  `;

  if (centerId !== undefined) {
    request.input("centerId", centerId);

    query += `
      AND t.centerId = @centerId
    `;
  }

  const result = await request.query<TeacherRecord>(
    query
  );

  return result.recordset[0] ?? null;
};

export const updateTeacher = async (
  id: number,
  input: UpdateTeacherInput,
  centerId?: number
): Promise<TeacherRecord | null> => {
  const current = await findTeacherById(
    id,
    centerId
  );

  if (!current) {
    return null;
  }

  const request = pool
    .request()
    .input("id", id)
    .input("name", input.name ?? current.name)
    .input("email", input.email ?? current.email)
    .input("phone", input.phone ?? current.phone)
    .input(
      "qualification",
      input.qualification ?? current.qualification
    )
    .input(
      "specialization",
      input.specialization ?? current.specialization
    )
    .input(
      "experience",
      input.experience ?? current.experience
    )
    .input(
      "status",
      input.status ?? current.status
    );

  let query = `
    UPDATE t
    SET
      t.phone = @phone,
      t.qualification = @qualification,
      t.specialization = @specialization,
      t.experience = @experience,
      t.status = @status,
      t.updatedAt = GETDATE()
    FROM teachers t
    INNER JOIN users u
      ON u.id = t.userId
    WHERE t.id = @id
      AND u.role = 'TEACHER'
  `;

  if (centerId !== undefined) {
    request.input("centerId", centerId);

    query += `
      AND t.centerId = @centerId
    `;
  }

  await request.query(query);

  const userRequest = pool
    .request()
    .input("userId", current.userId)
    .input("name", input.name ?? current.name)
    .input("email", input.email ?? current.email);

  await userRequest.query(`
    UPDATE users
    SET
      name = @name,
      email = @email,
      updatedAt = GETDATE()
    WHERE id = @userId
      AND role = 'TEACHER'
  `);

  return findTeacherById(id, centerId);
};

export const deactivateTeacher = async (
  id: number,
  centerId?: number
): Promise<TeacherRecord | null> => {
  const current = await findTeacherById(
    id,
    centerId
  );

  if (!current) {
    return null;
  }

  const request = pool
    .request()
    .input("id", id);

  let query = `
    UPDATE t
    SET
      t.status = 'INACTIVE',
      t.updatedAt = GETDATE()
    FROM teachers t
    WHERE t.id = @id
  `;

  if (centerId !== undefined) {
    request.input("centerId", centerId);

    query += `
      AND t.centerId = @centerId
    `;
  }

  await request.query(query);

  await pool
    .request()
    .input("userId", current.userId)
    .query(`
      UPDATE users
      SET
        status = 'INACTIVE',
        updatedAt = GETDATE()
      WHERE id = @userId
        AND role = 'TEACHER'
    `);

  return findTeacherById(id, centerId);
};