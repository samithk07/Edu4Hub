"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = void 0;
const database_1 = require("@edu4hub/database");
const findUserByEmail = async (email) => {
    const result = await database_1.pool
        .request()
        .input("email", email)
        .query(`
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
exports.findUserByEmail = findUserByEmail;
