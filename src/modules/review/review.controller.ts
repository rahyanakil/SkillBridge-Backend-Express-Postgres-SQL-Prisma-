// src/app/modules/review/review.controller.ts
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ReviewService.createReview(req.user.id, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review submitted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

// ১. সব রিভিউ দেখার রুট (পাবলিক)

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ReviewService.getAllReviews();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const getReviewsForCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ReviewService.getReviewsForCourse(
      req.params.courseId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Course reviews loaded successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getReviewsForTutor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ReviewService.getReviewsForTutor(
      req.params.tutorId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tutor reviews loaded successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewsForCourse,
  getReviewsForTutor,
};
