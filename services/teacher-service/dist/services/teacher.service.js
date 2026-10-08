"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacherService = exports.updateTeacherService = exports.getTeacherByIdService = exports.getAllTeachersService = exports.createTeacherService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const teacher_repository_1 = require("../repositories/teacher.repository");
const createTeacherService = async (input) => {
    const existingTeacher = await (0, teacher_repository_1.findTeacherByEmail)(input.email);
    if (existingTeacher) {
        throw new Error("A teacher with this email already exists");
    }
    const passwordHash = await bcrypt_1.default.hash(input.password, 12);
    const userId = await (0, teacher_repository_1.createTeacherUser)(input, passwordHash);
    const teacher = await (0, teacher_repository_1.createTeacherProfile)(userId, input);
    if (!teacher) {
        throw new Error("Failed to create teacher profile");
    }
    return teacher;
};
exports.createTeacherService = createTeacherService;
const getAllTeachersService = async (centerId) => {
    return (0, teacher_repository_1.findAllTeachers)(centerId);
};
exports.getAllTeachersService = getAllTeachersService;
const getTeacherByIdService = async (id, centerId) => {
    return (0, teacher_repository_1.findTeacherById)(id, centerId);
};
exports.getTeacherByIdService = getTeacherByIdService;
const updateTeacherService = async (id, input, centerId) => {
    return (0, teacher_repository_1.updateTeacher)(id, input, centerId);
};
exports.updateTeacherService = updateTeacherService;
const deleteTeacherService = async (id, centerId) => {
    return (0, teacher_repository_1.deactivateTeacher)(id, centerId);
};
exports.deleteTeacherService = deleteTeacherService;
