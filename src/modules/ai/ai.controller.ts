import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AIService } from "./ai.service";

const askAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reply = await AIService.askAI(req.body.prompt);
    sendResponse(res, { statusCode: 200, success: true, message: "AI response generated", data: { reply } });
  } catch (err: any) { next(err); }
};

export const AIController = { askAI };
