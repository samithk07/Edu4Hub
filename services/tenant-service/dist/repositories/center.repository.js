"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateCenter = exports.updateCenter = exports.findCenterById = exports.findAllCenters = exports.createCenter = void 0;
const database_1 = require("@edu4hub/database");
const createCenter = async (input) => {
    const result = await database_1.pool
        .request()
        .input("name", input.name)
        .input("email", input.email)
        .input("phone", input.phone ?? null)
        .input("address", input.address ?? null)
        .query(`
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
exports.createCenter = createCenter;
const findAllCenters = async () => {
    const result = await database_1.pool
        .request()
        .query(`
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
exports.findAllCenters = findAllCenters;
const findCenterById = async (id) => {
    const result = await database_1.pool
        .request()
        .input("id", id)
        .query(`
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
exports.findCenterById = findCenterById;
const updateCenter = async (id, input) => {
    const current = await (0, exports.findCenterById)(id);
    if (!current) {
        return null;
    }
    const result = await database_1.pool
        .request()
        .input("id", id)
        .input("name", input.name ?? current.name)
        .input("email", input.email ?? current.email)
        .input("phone", input.phone ?? current.phone)
        .input("address", input.address ?? current.address)
        .input("status", input.status ?? current.status)
        .query(`
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
exports.updateCenter = updateCenter;
const deactivateCenter = async (id) => {
    const result = await database_1.pool
        .request()
        .input("id", id)
        .query(`
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
exports.deactivateCenter = deactivateCenter;
