"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminService = exports.updateAdminService = exports.getAdminByIdService = exports.getAllAdminsService = exports.createAdminService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_repository_1 = require("../repositories/admin.repository");
const createAdminService = async (input) => {
    const existingAdmin = await (0, admin_repository_1.findAdminByEmail)(input.email);
    if (existingAdmin) {
        throw new Error("An admin with this email already exists");
    }
    const passwordHash = await bcrypt_1.default.hash(input.password, 12);
    return (0, admin_repository_1.createAdmin)(input, passwordHash);
};
exports.createAdminService = createAdminService;
const getAllAdminsService = async () => {
    return (0, admin_repository_1.findAllAdmins)();
};
exports.getAllAdminsService = getAllAdminsService;
const getAdminByIdService = async (id) => {
    return (0, admin_repository_1.findAdminById)(id);
};
exports.getAdminByIdService = getAdminByIdService;
const updateAdminService = async (id, input) => {
    return (0, admin_repository_1.updateAdmin)(id, input);
};
exports.updateAdminService = updateAdminService;
const deleteAdminService = async (id) => {
    return (0, admin_repository_1.deactivateAdmin)(id);
};
exports.deleteAdminService = deleteAdminService;
