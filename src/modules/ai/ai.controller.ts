import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AIService } from "./ai.service";

const askAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reply = await AIService.askAI(req.body.prompt);
    sendResponse(res, { statusCode: 200, success: true, message: "AI response generated", data: { reply } });
  } catch (err: any) {
    if (typeof err?.message === "string" && err.message.startsWith("AI_RATE_LIMIT:")) {
      return sendResponse(res, {
        statusCode: 429,
        success: false,
        message: err.message.replace("AI_RATE_LIMIT: ", ""),
      });
    }
    next(err);
  }
};

export const AIController = { askAI };
