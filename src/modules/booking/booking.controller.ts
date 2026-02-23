// src/app/modules/booking/booking.controller.ts
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.createBooking(req.user.id, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getStudentBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.getBookingsByStudent(req.user.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Your bookings fetched successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getTutorBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.getBookingsByTutor(req.user.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tutor bookings fetched successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookingService.updateBookingStatus(
      req.params.id as string,
      req.user.id,
      req.body.status,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking status updated successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const BookingController = {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  updateBookingStatus,
};
