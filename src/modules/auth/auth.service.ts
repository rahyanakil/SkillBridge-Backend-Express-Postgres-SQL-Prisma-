import bcrypt from "bcryptjs";
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

export const AuthService = {
  createUser,
};
