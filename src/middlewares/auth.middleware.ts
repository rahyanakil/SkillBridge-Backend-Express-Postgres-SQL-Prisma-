import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const secret = process.env.JWT_SECRET!;

export enum UserRole {
  admin = "ADMIN",
  student = "STUDENT",
  tutor = "TUTOR",
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error("Token not found!!");
      }
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
      const decoded = jwt.verify(token, secret) as JwtPayload;

      const userData = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      if (!userData) {
        throw new Error("Unauthorized!");
      }
      if (userData.isBanned) {
        throw new Error("Your account has been suspended. Contact support.");
      }
      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("Unauthorized");
      }

      req.user = userData;
      next();
    } catch (err: any) {
      next(err);
    }
  };
};

export default auth;
