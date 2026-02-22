import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { TutorService } from "./tutor.service";

const createOrUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.createOrUpdateProfile(
      req.user.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "tutor created",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const getProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getProfileByUserId(req.user.id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "tutor profile fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getAllTutors();
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All tutors fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
export const TutorController = {
  createOrUpdateProfile,
  getProfileByUserId,
  getAllTutors,
};
