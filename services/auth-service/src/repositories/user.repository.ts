import { pool } from "@edu4hub/database";

export interface UserRecord {
  id: number;
  centerId: number | null;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  status: string;
}

export const findUserByEmail = async (
  email: string
): Promise<UserRecord | null> => {
  const result = await pool
    .request()
    .input("email", email)
    .query<UserRecord>(`
      SELECT
        id,
        centerId,
        name,
        email,
        passwordHash,
        role,
        status
      FROM users
      WHERE email = @email
    `);

  return result.recordset[0] ?? null;
};