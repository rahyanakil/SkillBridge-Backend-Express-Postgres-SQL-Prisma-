import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { NotificationService } from "./notification.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await NotificationService.getUserNotifications(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Notifications fetched", data: result });
  } catch (err: any) { next(err); }
};

const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await NotificationService.getUnreadCount(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Unread count", data: result });
  } catch (err: any) { next(err); }
};

const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await NotificationService.markAsRead(req.params.id, req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Marked as read", data: result });
  } catch (err: any) { next(err); }
};

const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "All marked as read", data: result });
  } catch (err: any) { next(err); }
};

export const NotificationController = { getAll, getUnreadCount, markAsRead, markAllAsRead };
