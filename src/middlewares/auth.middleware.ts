import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const secret = process.env.JWT_SECRET || "your-secret-key";

export enum UserRole {
  admin = "ADMIN",
  student = "STUDENT",
  tutor = "TUTOR",
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("Token not found!!");
      }
      const decoded = jwt.verify(token, secret) as JwtPayload;

      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });
      if (!userData) {
        throw new Error("Unauthorized!");
      }
      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("Unauthorized");
      }
      // req.user = decoded;
      req.user = userData;
      next();
    } catch (err: any) {
      next(err);
    }
  };
};

export default auth;
