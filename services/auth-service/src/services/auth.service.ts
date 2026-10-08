import "dotenv/config";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  UserRecord,
} from "../repositories/user.repository";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: {
    id: number;
    centerId: number | null;
    name: string;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const login = async (
  input: LoginInput
): Promise<LoginResult> => {
  const { email, password } = input;

  // 1. Find user by email
  const user: UserRecord | null =
    await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Check whether the account is active
  if (user.status !== "ACTIVE") {
    throw new Error("User account is inactive");
  }

  // 3. Compare plain password with bcrypt hash
  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

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
  const accessToken = jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

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