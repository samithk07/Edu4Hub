"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateStudentById = exports.updateStudentById = exports.getStudentById = exports.getStudents = exports.createStudent = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const student_repository_1 = require("../repositories/student.repository");
const createStudent = async (data) => {
    const existingStudent = await (0, student_repository_1.findStudentByEmail)(data.email);
    if (existingStudent) {
        const error = new Error("Student email already exists");
        error.statusCode = 409;
        throw error;
    }
    const passwordHash = await bcrypt_1.default.hash(data.password, 12);
    const userId = await (0, student_repository_1.createStudentUser)({
        name: data.name,
        email: data.email,
        passwordHash,
    });
    const studentId = await (0, student_repository_1.createStudentProfile)({
        userId,
        centerId: data.centerId,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        admissionNumber: data.admissionNumber,
    });
    return (0, student_repository_1.findStudentById)(studentId, data.centerId);
};
exports.createStudent = createStudent;
const getStudents = async (centerId) => {
    return (0, student_repository_1.findAllStudents)(centerId);
};
exports.getStudents = getStudents;
const getStudentById = async (studentId, centerId) => {
    const student = await (0, student_repository_1.findStudentById)(studentId, centerId);
    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }
    return student;
};
exports.getStudentById = getStudentById;
const updateStudentById = async (studentId, data, centerId) => {
    const existingStudent = await (0, student_repository_1.findStudentById)(studentId, centerId);
    if (!existingStudent) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }
    if (data.email &&
        data.email !== existingStudent.email) {
        const emailExists = await (0, student_repository_1.findStudentByEmail)(data.email);
        if (emailExists &&
            emailExists.userId !== existingStudent.userId) {
            const error = new Error("Student email already exists");
            error.statusCode = 409;
            throw error;
        }
    }
    return (0, student_repository_1.updateStudent)(studentId, data, centerId);
};
exports.updateStudentById = updateStudentById;
const deactivateStudentById = async (studentId, centerId) => {
    const existingStudent = await (0, student_repository_1.findStudentById)(studentId, centerId);
    if (!existingStudent) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }
    return (0, student_repository_1.deactivateStudent)(studentId, centerId);
};
exports.deactivateStudentById = deactivateStudentById;
