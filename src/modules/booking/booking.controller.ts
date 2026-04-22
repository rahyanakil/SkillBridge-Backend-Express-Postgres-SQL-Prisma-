import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.createBooking(req.user.id, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Booking created successfully", data: result });
  } catch (err: any) { next(err); }
};

const getStudentBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.getBookingsByStudent(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Your bookings fetched successfully", data: result });
  } catch (err: any) { next(err); }
};

const getCompletedBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.getCompletedByStudent(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Completed courses fetched", data: result });
  } catch (err: any) { next(err); }
};

const getTutorBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.getBookingsByTutor(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Tutor bookings fetched successfully", data: result });
  } catch (err: any) { next(err); }
};

const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.updateBookingStatus(req.params.id, req.user.id, req.body.status);
    sendResponse(res, { statusCode: 200, success: true, message: "Booking status updated successfully", data: result });
  } catch (err: any) { next(err); }
};

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.cancelBooking(req.params.id, req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Booking cancelled successfully", data: result });
  } catch (err: any) { next(err); }
};

const getClassroomLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.generateClassroomLink(req.params.id, req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Classroom link ready", data: result });
  } catch (err: any) { next(err); }
};

export const BookingController = {
  createBooking,
  getStudentBookings,
  getCompletedBookings,
  getTutorBookings,
  updateBookingStatus,
  cancelBooking,
  getClassroomLink,
};
