import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { CourseService } from "./course.service";

const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseService.createCourse(req.user.id, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Course created", data: result });
  } catch (err: any) { next(err); }
};

const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseService.getCourseById(req.params.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Course fetched successfully", data: result });
  } catch (err: any) { next(err); }
};

const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseService.getAllCourses(req.query);
    sendResponse(res, { statusCode: 200, success: true, message: "Courses fetched successfully", data: result });
  } catch (err: any) { next(err); }
};

const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseService.updateCourse(req.params.id, req.user.id, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Course updated successfully", data: result });
  } catch (err: any) { next(err); }
};

const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CourseService.deleteCourse(req.params.id, req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Course deleted successfully", data: null });
  } catch (err: any) { next(err); }
};

const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseService.getRecommendations(req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Recommendations fetched", data: result });
  } catch (err: any) { next(err); }
};

export const CourseController = {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getRecommendations,
};
