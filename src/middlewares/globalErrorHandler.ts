import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = err.message || "Internal server Error!";
  let errorDetails = err;

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please login again.";
    errorDetails = {};
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
    errorDetails = {};
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Failed";
    errorDetails = err.issues;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Prisma Request Error";
    errorDetails = err.meta;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid input data or missing fields";
    errorDetails = err.message;
  } else if (err instanceof Error) {
    statusCode = 400;
    message = err.message;
    errorDetails = process.env.NODE_ENV === "development" ? err.stack : {};
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorDetails,
  });
}
