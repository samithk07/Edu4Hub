import { pool } from "@edu4hub/database";
import type {
  CreateCenterInput,
  UpdateCenterInput,
} from "../validators/center.validator";

export interface CenterRecord {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createCenter = async (
  input: CreateCenterInput
): Promise<CenterRecord> => {
  const result = await pool
    .request()
    .input("name", input.name)
    .input("email", input.email)
    .input("phone", input.phone ?? null)
    .input("address", input.address ?? null)
    .query<CenterRecord>(`
      INSERT INTO centers (
        name,
        email,
        phone,
        address,
        status
      )
      OUTPUT
        INSERTED.id,
        INSERTED.name,
        INSERTED.email,
        INSERTED.phone,
        INSERTED.address,
        INSERTED.status,
        INSERTED.createdAt,
        INSERTED.updatedAt
      VALUES (
        @name,
        @email,
        @phone,
        @address,
        'ACTIVE'
      )
    `);

  return result.recordset[0];
};

export const findAllCenters = async (): Promise<
  CenterRecord[]
> => {
  const result = await pool
    .request()
    .query<CenterRecord>(`
      SELECT
        id,
        name,
        email,
        phone,
        address,
        status,
        createdAt,
        updatedAt
      FROM centers
      ORDER BY id DESC
    `);

  return result.recordset;
};

export const findCenterById = async (
  id: number
): Promise<CenterRecord | null> => {
  const result = await pool
    .request()
    .input("id", id)
    .query<CenterRecord>(`
      SELECT
        id,
        name,
        email,
        phone,
        address,
        status,
        createdAt,
        updatedAt
      FROM centers
      WHERE id = @id
    `);

  return result.recordset[0] ?? null;
};

export const updateCenter = async (
  id: number,
  input: UpdateCenterInput
): Promise<CenterRecord | null> => {
  const current = await findCenterById(id);

  if (!current) {
    return null;
  }

  const result = await pool
    .request()
    .input("id", id)
    .input("name", input.name ?? current.name)
    .input("email", input.email ?? current.email)
    .input("phone", input.phone ?? current.phone)
    .input("address", input.address ?? current.address)
    .input("status", input.status ?? current.status)
    .query<CenterRecord>(`
      UPDATE centers
      SET
        name = @name,
        email = @email,
        phone = @phone,
        address = @address,
        status = @status,
        updatedAt = GETDATE()
      OUTPUT
        INSERTED.id,
        INSERTED.name,
        INSERTED.email,
        INSERTED.phone,
        INSERTED.address,
        INSERTED.status,
        INSERTED.createdAt,
        INSERTED.updatedAt
      WHERE id = @id
    `);

  return result.recordset[0] ?? null;
};

export const deactivateCenter = async (
  id: number
): Promise<CenterRecord | null> => {
  const result = await pool
    .request()
    .input("id", id)
    .query<CenterRecord>(`
      UPDATE centers
      SET
        status = 'INACTIVE',
        updatedAt = GETDATE()
      OUTPUT
        INSERTED.id,
        INSERTED.name,
        INSERTED.email,
        INSERTED.phone,
        INSERTED.address,
        INSERTED.status,
        INSERTED.createdAt,
        INSERTED.updatedAt
      WHERE id = @id
    `);

  return result.recordset[0] ?? null;
};