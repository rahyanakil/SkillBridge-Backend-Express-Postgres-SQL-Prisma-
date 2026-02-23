import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoryService.createCategory(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoryService.getAllCategories();
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "All Category fetched successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await CategoryService.updateCategory(id as string, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "category updated successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await CategoryService.deleteCategory(id as string);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "category deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
