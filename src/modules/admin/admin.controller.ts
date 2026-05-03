import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getAllUsers(req.query as any);
    sendResponse(res, { statusCode: 200, success: true, message: "All users retrieved successfully", data: result });
  } catch (err: any) { next(err); }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.updateUserStatus(req.params.userId, req.body.isBanned);
    sendResponse(res, { statusCode: 200, success: true, message: "User status updated successfully", data: result });
  } catch (err: any) { next(err); }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.deleteUser(req.params.userId);
    sendResponse(res, { statusCode: 200, success: true, message: "User deleted successfully", data: result });
  } catch (err: any) { next(err); }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getAllBookings(req.query as any);
    sendResponse(res, { statusCode: 200, success: true, message: "All bookings retrieved successfully", data: result });
  } catch (err: any) { next(err); }
};

const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.deleteCourse(req.params.courseId);
    sendResponse(res, { statusCode: 200, success: true, message: "Course deleted successfully", data: result });
  } catch (err: any) { next(err); }
};

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getStats();
    sendResponse(res, { statusCode: 200, success: true, message: "Stats retrieved successfully", data: result });
  } catch (err: any) { next(err); }
};

const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.updateBookingStatus(req.params.bookingId, req.body.status);
    sendResponse(res, { statusCode: 200, success: true, message: "Booking status updated", data: result });
  } catch (err: any) { next(err); }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.createCategory(req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Category created", data: result });
  } catch (err: any) { next(err); }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.deleteCategory(req.params.categoryId);
    sendResponse(res, { statusCode: 200, success: true, message: "Category deleted", data: result });
  } catch (err: any) { next(err); }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  deleteCourse,
  getStats,
  createCategory,
  deleteCategory,
};
