// src/app/modules/course/course.controller.ts
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { CourseService } from "./course.service";

const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CourseService.createCourse(req.user.id, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Course created",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await CourseService.getCourseById(id as string);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Course fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CourseService.getAllCourses(req.query);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All Courses Fetched Successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const result = await CourseService.updateCourse(id, req.user.id, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Course Updated successfully",
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
    const result = await CourseService.deleteCourse(
      req.params.id as string,
      req.user.id,
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Course Deleted Successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const CourseController = {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
};
