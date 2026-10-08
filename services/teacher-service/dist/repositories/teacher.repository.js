"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateTeacher = exports.updateTeacher = exports.findTeacherById = exports.findAllTeachers = exports.createTeacherProfile = exports.createTeacherUser = exports.findTeacherByEmail = void 0;
const database_1 = require("@edu4hub/database");
const findTeacherByEmail = async (email) => {
    const result = await database_1.pool
        .request()
        .input("email", email)
        .query(`
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
exports.findTeacherByEmail = findTeacherByEmail;
const createTeacherUser = async (input, passwordHash) => {
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
exports.createTeacherUser = createTeacherUser;
const createTeacherProfile = async (userId, input) => {
    const result = await database_1.pool
        .request()
        .input("userId", userId)
        .input("centerId", input.centerId)
        .input("phone", input.phone ?? null)
        .input("qualification", input.qualification ?? null)
        .input("specialization", input.specialization ?? null)
        .input("experience", input.experience ?? null)
        .query(`
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
exports.createTeacherProfile = createTeacherProfile;
const findAllTeachers = async (centerId) => {
    const request = database_1.pool.request();
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
    const result = await request.query(query);
    return result.recordset;
};
exports.findAllTeachers = findAllTeachers;
const findTeacherById = async (id, centerId) => {
    const request = database_1.pool
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
    const result = await request.query(query);
    return result.recordset[0] ?? null;
};
exports.findTeacherById = findTeacherById;
const updateTeacher = async (id, input, centerId) => {
    const current = await (0, exports.findTeacherById)(id, centerId);
    if (!current) {
        return null;
    }
    const request = database_1.pool
        .request()
        .input("id", id)
        .input("name", input.name ?? current.name)
        .input("email", input.email ?? current.email)
        .input("phone", input.phone ?? current.phone)
        .input("qualification", input.qualification ?? current.qualification)
        .input("specialization", input.specialization ?? current.specialization)
        .input("experience", input.experience ?? current.experience)
        .input("status", input.status ?? current.status);
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
    const userRequest = database_1.pool
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
    return (0, exports.findTeacherById)(id, centerId);
};
exports.updateTeacher = updateTeacher;
const deactivateTeacher = async (id, centerId) => {
    const current = await (0, exports.findTeacherById)(id, centerId);
    if (!current) {
        return null;
    }
    const request = database_1.pool
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
    await database_1.pool
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
    return (0, exports.findTeacherById)(id, centerId);
};
exports.deactivateTeacher = deactivateTeacher;
