import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { TutorService } from "./tutor.service";

const createOrUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.createOrUpdateProfile(req.user.id, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Tutor profile saved", data: result });
  } catch (err: any) { next(err); }
};

const getProfileByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.getProfileByUserId(req.params.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Tutor profile fetched successfully", data: result });
  } catch (err: any) { next(err); }
};

const getAllTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.getAllTutors();
    sendResponse(res, { statusCode: 200, success: true, message: "All tutors fetched successfully", data: result });
  } catch (err: any) { next(err); }
};

const getEarnings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.getEarnings(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Earnings fetched", data: result });
  } catch (err: any) { next(err); }
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.getMyProfile(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "My tutor profile fetched", data: result });
  } catch (err: any) { next(err); }
};

export const TutorController = {
  createOrUpdateProfile,
  getProfileByUserId,
  getMyProfile,
  getAllTutors,
  getEarnings,
};
