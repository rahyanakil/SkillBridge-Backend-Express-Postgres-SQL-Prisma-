import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PaymentService.createCheckout(req.body.bookingId, req.user.id);
    sendResponse(res, { statusCode: 200, success: true, message: "Payment intent created", data: result });
  } catch (err: any) { next(err); }
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PaymentService.verifyPayment(
      req.body.bookingId,
      req.body.paymentIntentId,
      req.user.id,
    );
    sendResponse(res, { statusCode: 200, success: true, message: "Payment verified successfully", data: result });
  } catch (err: any) { next(err); }
};

export const PaymentController = { checkout, verify };
