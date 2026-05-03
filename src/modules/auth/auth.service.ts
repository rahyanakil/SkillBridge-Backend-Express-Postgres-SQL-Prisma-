import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";

const createUser = async (payload: any) => {
  const hashPassword = await bcrypt.hash(payload.password, 8);
  const result = await prisma.user.create({ data: { ...payload, password: hashPassword } });
  const { password, ...safe } = result;
  return safe;
};

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) throw new Error("User not found");
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) throw new Error("Invalid credentials!!");
  if (user.isBanned) throw new Error("Your account has been suspended. Contact support.");

  const userData = { id: user.id, name: user.name, role: user.role, email: user.email };
  const token = jwt.sign(userData, config.jwt.secret as string, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
  const { password, ...safeUser } = user;
  return { token, user: safeUser };
};

const getMe = async (userId: string) => {
  const result = await prisma.user.findUnique({ where: { id: userId } });
  if (!result) throw new Error("User not found!");
  const { password, ...safe } = result;
  return safe;
};

const updateProfile = async (userId: string, payload: { name?: string; email?: string }) => {
  if (payload.email) {
    const existing = await prisma.user.findFirst({ where: { email: payload.email, NOT: { id: userId } } });
    if (existing) throw new Error("Email already in use by another account");
  }
  const result = await prisma.user.update({ where: { id: userId }, data: payload });
  const { password, ...safe } = result;
  return safe;
};

const changePassword = async (userId: string, payload: { oldPassword: string; newPassword: string }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");
  const hashed = await bcrypt.hash(payload.newPassword, 8);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return { message: "Password changed successfully" };
};

const updateAvatar = async (userId: string, avatarUrl: string) => {
  const result = await prisma.user.update({ where: { id: userId }, data: { avatar: avatarUrl } });
  const { password, ...safe } = result;
  return safe;
};

const googleAuth = async (payload: {
  email: string;
  name: string;
  avatar?: string;
}) => {
  let user = await prisma.user.findUnique({ where: { email: payload.email } });

  if (!user) {
    const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now(), 8);
    user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        avatar: payload.avatar ?? null,
        password: randomPassword,
        role: "STUDENT",
      },
    });
  }

  if (user.isBanned) throw new Error("Your account has been suspended. Contact support.");

  const userData = { id: user.id, name: user.name, role: user.role, email: user.email };
  const token = jwt.sign(userData, config.jwt.secret as string, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
  const { password, ...safeUser } = user;
  return { token, user: safeUser };
};

export const AuthService = {
  createUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  updateAvatar,
  googleAuth,
};
