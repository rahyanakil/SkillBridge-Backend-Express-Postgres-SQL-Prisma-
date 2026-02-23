// src/app/modules/admin/admin.controller.ts
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getAllUsers();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All users retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AdminService.updateUserStatus(
      req.params.userId as string,
      req.body.isBanned,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AdminService.getAllBookings();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AdminService.deleteCourse(
      req.params.courseId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Course deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  deleteCourse,
};
