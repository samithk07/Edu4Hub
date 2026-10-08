"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}
const login = async (input) => {
    const { email, password } = input;
    // 1. Find user by email
    const user = await (0, user_repository_1.findUserByEmail)(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }
    // 2. Check whether the account is active
    if (user.status !== "ACTIVE") {
        throw new Error("User account is inactive");
    }
    // 3. Compare plain password with bcrypt hash
    const passwordMatches = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!passwordMatches) {
        throw new Error("Invalid email or password");
    }
    // 4. Create JWT payload
    const payload = {
        userId: user.id,
        centerId: user.centerId,
        role: user.role,
    };
    // 5. Generate JWT
    const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: "15m",
    });
    // 6. Return safe user information
    return {
        accessToken,
        user: {
            id: user.id,
            centerId: user.centerId,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
exports.login = login;
