import { prisma } from "../../lib/prisma";

const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
};

const getUnreadCount = async (userId: string) => {
  const count = await prisma.notification.count({ where: { userId, isRead: false } });
  return { unreadCount: count };
};

const markAsRead = async (id: string, userId: string) => {
  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif || notif.userId !== userId) throw new Error("Notification not found");
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return { message: "All notifications marked as read" };
};

export const NotificationService = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
