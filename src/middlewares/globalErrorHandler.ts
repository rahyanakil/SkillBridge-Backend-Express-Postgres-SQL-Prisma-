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
  let errMessage = "Internal server Error!";
  let errorDetails = err;
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: err.issues,
    });
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    ((statusCode = 400), (errMessage = "Incorrect body or missing a fields"));
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errMessage = "Invalid input data";
    errorDetails = err.message; // optional: full prisma message
  }
  res.status(statusCode).json({
    success: false,
    message: errMessage,
    error: errorDetails,
  });
}
