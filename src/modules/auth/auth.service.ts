import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../../config";
import { prisma } from "../../lib/prisma";

const createUser = async (payload: any) => {
  const hashPassword = await bcrypt.hash(payload.password, 8);

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashPassword,
    },
  });
  const { password, ...newPassword } = result;
  return newPassword;
};
const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials!!");
  }
  const userData = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };
  // const signOptions: SignOptions = {
  //   expiresIn: config.jwt.expiresIn,
  // };
  const token = jwt.sign(userData, config.jwt.secret as string, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
  const { password, ...safeUser } = user;
  return {
    token,
    user: safeUser,
  };
};
export const AuthService = {
  createUser,
  loginUser,
};
