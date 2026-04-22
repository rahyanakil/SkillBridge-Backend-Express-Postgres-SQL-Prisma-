import { prisma } from "./prisma";

export const notify = async (
  userId: string,
  type: string,
  title: string,
  message: string,
) => {
  await prisma.notification.create({ data: { userId, type, title, message } });
};
