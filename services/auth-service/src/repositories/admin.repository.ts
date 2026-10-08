import { pool } from "@edu4hub/database";

import type {
  CreateAdminInput,
  UpdateAdminInput,
} from "../validators/admin.validator";

export interface AdminRecord {
  id: number;
  centerId: number | null;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const findAdminByEmail = async (
  email: string
): Promise<AdminRecord | null> => {
  const result = await pool
    .request()
    .input("email", email)
    .query<AdminRecord>(`
      SELECT
        id,
        centerId,
        name,
        email,
        role,
        status,
        createdAt,
        updatedAt
      FROM users
      WHERE email = @email
        AND role = 'CENTER_ADMIN'
    `);

  return result.recordset[0] ?? null;
};

export const createAdmin = async (
  input: CreateAdminInput,
  passwordHash: string
): Promise<AdminRecord> => {
  const result = await pool
    .request()
    .input("centerId", input.centerId)
    .input("name", input.name)
    .input("email", input.email)
    .input("passwordHash", passwordHash)
    .query<AdminRecord>(`
      INSERT INTO users (
        centerId,
        name,
        email,
        passwordHash,
        role,
        status
      )
      OUTPUT
        INSERTED.id,
        INSERTED.centerId,
        INSERTED.name,
        INSERTED.email,
        INSERTED.role,
        INSERTED.status,
        INSERTED.createdAt,
        INSERTED.updatedAt
      VALUES (
        @centerId,
        @name,
        @email,
        @passwordHash,
        'CENTER_ADMIN',
        'ACTIVE'
      )
    `);

  return result.recordset[0];
};

export const findAllAdmins = async (): Promise<
  AdminRecord[]
> => {
  const result = await pool
    .request()
    .query<AdminRecord>(`
      SELECT
        id,
        centerId,
        name,
        email,
        role,
        status,
        createdAt,
        updatedAt
      FROM users
      WHERE role = 'CENTER_ADMIN'
      ORDER BY id DESC
    `);

  return result.recordset;
};

export const findAdminById = async (
  id: number
): Promise<AdminRecord | null> => {
  const result = await pool
    .request()
    .input("id", id)
    .query<AdminRecord>(`
      SELECT
        id,
        centerId,
        name,
        email,
        role,
        status,
        createdAt,
        updatedAt
      FROM users
      WHERE id = @id
        AND role = 'CENTER_ADMIN'
    `);

  return result.recordset[0] ?? null;
};

export const updateAdmin = async (
  id: number,
  input: UpdateAdminInput
): Promise<AdminRecord | null> => {
  const current = await findAdminById(id);

  if (!current) {
    return null;
  }

  const result = await pool
    .request()
    .input("id", id)
    .input("name", input.name ?? current.name)
    .input("email", input.email ?? current.email)
    .input("centerId", input.centerId ?? current.centerId)
    .input("status", input.status ?? current.status)
    .query<AdminRecord>(`
      UPDATE users
      SET
        name = @name,
        email = @email,
        centerId = @centerId,
        status = @status,
        updatedAt = GETDATE()
      OUTPUT
        INSERTED.id,
        INSERTED.centerId,
        INSERTED.name,
        INSERTED.email,
        INSERTED.role,
        INSERTED.status,
        INSERTED.createdAt,
        INSERTED.updatedAt
      WHERE id = @id
        AND role = 'CENTER_ADMIN'
    `);

  return result.recordset[0] ?? null;
};

export const deactivateAdmin = async (
  id: number
): Promise<AdminRecord | null> => {
  const result = await pool
    .request()
    .input("id", id)
    .query<AdminRecord>(`
      UPDATE users
      SET
        status = 'INACTIVE',
        updatedAt = GETDATE()
      OUTPUT
        INSERTED.id,
        INSERTED.centerId,
        INSERTED.name,
        INSERTED.email,
        INSERTED.role,
        INSERTED.status,
        INSERTED.createdAt,
        INSERTED.updatedAt
      WHERE id = @id
        AND role = 'CENTER_ADMIN'
    `);

  return result.recordset[0] ?? null;
};