import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.createUser(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.cookie("token", result.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict",
    });
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const AuthController = {
  createUser,
  loginUser,
};
