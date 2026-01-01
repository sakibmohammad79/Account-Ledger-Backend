import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendResponse } from "../utils/SendResponse";


export const validateRequest = (schema: z.ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "validation error",
          errorMessages: error.issues
        });
      }

      return next(error);
    }
  };
};
