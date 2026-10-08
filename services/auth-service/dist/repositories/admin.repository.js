"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAdmin = exports.updateAdmin = exports.findAdminById = exports.findAllAdmins = exports.createAdmin = exports.findAdminByEmail = void 0;
const database_1 = require("@edu4hub/database");
const findAdminByEmail = async (email) => {
    const result = await database_1.pool
        .request()
        .input("email", email)
        .query(`
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
exports.findAdminByEmail = findAdminByEmail;
const createAdmin = async (input, passwordHash) => {
    const result = await database_1.pool
        .request()
        .input("centerId", input.centerId)
        .input("name", input.name)
        .input("email", input.email)
        .input("passwordHash", passwordHash)
        .query(`
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
exports.createAdmin = createAdmin;
const findAllAdmins = async () => {
    const result = await database_1.pool
        .request()
        .query(`
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
exports.findAllAdmins = findAllAdmins;
const findAdminById = async (id) => {
    const result = await database_1.pool
        .request()
        .input("id", id)
        .query(`
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
exports.findAdminById = findAdminById;
const updateAdmin = async (id, input) => {
    const current = await (0, exports.findAdminById)(id);
    if (!current) {
        return null;
    }
    const result = await database_1.pool
        .request()
        .input("id", id)
        .input("name", input.name ?? current.name)
        .input("email", input.email ?? current.email)
        .input("centerId", input.centerId ?? current.centerId)
        .input("status", input.status ?? current.status)
        .query(`
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
exports.updateAdmin = updateAdmin;
const deactivateAdmin = async (id) => {
    const result = await database_1.pool
        .request()
        .input("id", id)
        .query(`
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
exports.deactivateAdmin = deactivateAdmin;
