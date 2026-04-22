import { NextFunction, Request, Response } from "express";
import { uploadToCloudinary } from "../../lib/cloudinary";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.createUser(req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "User created", data: result });
  } catch (err: any) { next(err); }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.cookie("token", result.token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    });
    sendResponse(res, { statusCode: 200, success: true, message: "User logged in successfully", data: result });
  } catch (err: any) { next(err); }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.getMe(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "User profile retrieved successfully", data: result });
  } catch (err: any) { next(err); }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.updateProfile(req.user.id, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Profile updated successfully", data: result });
  } catch (err: any) { next(err); }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.changePassword(req.user.id, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Password changed successfully", data: result });
  } catch (err: any) { next(err); }
};

const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new Error("No file uploaded");
    const avatarUrl = await uploadToCloudinary(req.file.buffer);
    const result = await AuthService.updateAvatar(req.user.id, avatarUrl);
    sendResponse(res, { statusCode: 200, success: true, message: "Avatar updated successfully", data: result });
  } catch (err: any) { next(err); }
};

export const AuthController = {
  createUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
};
