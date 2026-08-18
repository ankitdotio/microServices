import { NextFunction, Request, Response } from "express";
import * as authServices from "../services/auth.services";
import { successResponse } from "shared";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authServices.registerService(req.body);
    successResponse(res, { user }, 201);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = authServices.loginService(req.body);
    successResponse(res, result, 200);
  } catch (error) {
    next(error);
  }
};

export const getmeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.body;
    const user = await authServices.getmeService(userId);
    return successResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
};
