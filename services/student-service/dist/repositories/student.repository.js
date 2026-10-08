"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateStudent = exports.updateStudent = exports.findStudentById = exports.findAllStudents = exports.createStudentProfile = exports.createStudentUser = exports.findStudentByEmail = void 0;
const database_1 = require("@edu4hub/database");
const findStudentByEmail = async (email) => {
    const result = await database_1.pool
        .request()
        .input("email", email)
        .query(`
      SELECT
        u.id AS userId,
        u.email,
        u.status AS userStatus,
        s.id AS studentId,
        s.centerId,
        s.phone,
        s.dateOfBirth,
        s.gender,
        s.address,
        s.admissionNumber,
        s.status
      FROM users u
      INNER JOIN students s
        ON u.id = s.userId
      WHERE u.email = @email
    `);
    return result.recordset[0] ?? null;
};
exports.findStudentByEmail = findStudentByEmail;
const createStudentUser = async (data) => {
    const result = await database_1.pool
        .request()
        .input("name", data.name)
        .input("email", data.email)
        .input("passwordHash", data.passwordHash)
        .input("role", "STUDENT")
        .input("status", "ACTIVE")
        .query(`
      INSERT INTO users (
        name,
        email,
        passwordHash,
        role,
        status
      )
      OUTPUT INSERTED.id
      VALUES (
        @name,
        @email,
        @passwordHash,
        @role,
        @status
      )
    `);
    return result.recordset[0].id;
};
exports.createStudentUser = createStudentUser;
const createStudentProfile = async (data) => {
    const result = await database_1.pool
        .request()
        .input("userId", data.userId)
        .input("centerId", data.centerId)
        .input("phone", data.phone ?? null)
        .input("dateOfBirth", data.dateOfBirth ?? null)
        .input("gender", data.gender ?? null)
        .input("address", data.address ?? null)
        .input("admissionNumber", data.admissionNumber)
        .query(`
      INSERT INTO students (
        userId,
        centerId,
        phone,
        dateOfBirth,
        gender,
        address,
        admissionNumber,
        status
      )
      OUTPUT INSERTED.id
      VALUES (
        @userId,
        @centerId,
        @phone,
        @dateOfBirth,
        @gender,
        @address,
        @admissionNumber,
        'ACTIVE'
      )
    `);
    return result.recordset[0].id;
};
exports.createStudentProfile = createStudentProfile;
const findAllStudents = async (centerId) => {
    const request = database_1.pool.request();
    let query = `
    SELECT
      s.id,
      s.userId,
      s.centerId,
      u.name,
      u.email,
      s.phone,
      s.dateOfBirth,
      s.gender,
      s.address,
      s.admissionNumber,
      s.status,
      s.createdAt,
      s.updatedAt
    FROM students s
    INNER JOIN users u
      ON s.userId = u.id
  `;
    if (centerId !== undefined) {
        request.input("centerId", centerId);
        query += `
      WHERE s.centerId = @centerId
    `;
    }
    query += `
    ORDER BY s.id DESC
  `;
    const result = await request.query(query);
    return result.recordset;
};
exports.findAllStudents = findAllStudents;
const findStudentById = async (studentId, centerId) => {
    const request = database_1.pool
        .request()
        .input("studentId", studentId);
    let query = `
    SELECT
      s.id,
      s.userId,
      s.centerId,
      u.name,
      u.email,
      s.phone,
      s.dateOfBirth,
      s.gender,
      s.address,
      s.admissionNumber,
      s.status,
      s.createdAt,
      s.updatedAt
    FROM students s
    INNER JOIN users u
      ON s.userId = u.id
    WHERE s.id = @studentId
  `;
    if (centerId !== undefined) {
        request.input("centerId", centerId);
        query += `
      AND s.centerId = @centerId
    `;
    }
    const result = await request.query(query);
    return result.recordset[0] ?? null;
};
exports.findStudentById = findStudentById;
const updateStudent = async (studentId, data, centerId) => {
    const request = database_1.pool
        .request()
        .input("studentId", studentId);
    const updates = [];
    if (data.name !== undefined) {
        request.input("name", data.name);
        updates.push("u.name = @name");
    }
    if (data.email !== undefined) {
        request.input("email", data.email);
        updates.push("u.email = @email");
    }
    if (data.phone !== undefined) {
        request.input("phone", data.phone);
        updates.push("s.phone = @phone");
    }
    if (data.dateOfBirth !== undefined) {
        request.input("dateOfBirth", data.dateOfBirth);
        updates.push("s.dateOfBirth = @dateOfBirth");
    }
    if (data.gender !== undefined) {
        request.input("gender", data.gender);
        updates.push("s.gender = @gender");
    }
    if (data.address !== undefined) {
        request.input("address", data.address);
        updates.push("s.address = @address");
    }
    if (data.admissionNumber !== undefined) {
        request.input("admissionNumber", data.admissionNumber);
        updates.push("s.admissionNumber = @admissionNumber");
    }
    if (data.status !== undefined) {
        request.input("status", data.status);
        updates.push("s.status = @status");
        updates.push("u.status = @status");
    }
    if (updates.length === 0) {
        return (0, exports.findStudentById)(studentId, centerId);
    }
    let query = `
    UPDATE s
    SET
      ${updates
        .filter((item) => item.startsWith("s."))
        .map((item) => item.replace("s.", ""))
        .join(", ")}
    FROM students s
    INNER JOIN users u
      ON s.userId = u.id
    WHERE s.id = @studentId
  `;
    if (centerId !== undefined) {
        request.input("centerId", centerId);
        query += `
      AND s.centerId = @centerId
    `;
    }
    await request.query(query);
    // Update user fields separately.
    const userUpdates = updates
        .filter((item) => item.startsWith("u."))
        .map((item) => item.replace("u.", ""));
    if (userUpdates.length > 0) {
        let userQuery = `
      UPDATE u
      SET ${userUpdates.join(", ")}
      FROM users u
      INNER JOIN students s
        ON u.id = s.userId
      WHERE s.id = @studentId
    `;
        if (centerId !== undefined) {
            userQuery += `
        AND s.centerId = @centerId
      `;
        }
        await request.query(userQuery);
    }
    return (0, exports.findStudentById)(studentId, centerId);
};
exports.updateStudent = updateStudent;
const deactivateStudent = async (studentId, centerId) => {
    const request = database_1.pool
        .request()
        .input("studentId", studentId);
    let query = `
    UPDATE s
    SET
      s.status = 'INACTIVE'
    FROM students s
    WHERE s.id = @studentId
  `;
    if (centerId !== undefined) {
        request.input("centerId", centerId);
        query += `
      AND s.centerId = @centerId
    `;
    }
    await request.query(query);
    // Also deactivate the student's login account.
    let userQuery = `
    UPDATE u
    SET
      u.status = 'INACTIVE'
    FROM users u
    INNER JOIN students s
      ON u.id = s.userId
    WHERE s.id = @studentId
  `;
    if (centerId !== undefined) {
        userQuery += `
      AND s.centerId = @centerId
    `;
    }
    await request.query(userQuery);
    return (0, exports.findStudentById)(studentId, centerId);
};
exports.deactivateStudent = deactivateStudent;
