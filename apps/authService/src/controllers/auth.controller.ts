import { NextFunction, Request, Response } from "express";
import * as authServices from "../services/auth.services";
import { AppError, successResponse } from "shared";

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
    const result = await authServices.loginService(req.body);
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
    const userId = req.header("x-user-id");
    if (!userId) {
      throw new AppError(500, "MISSING x-user-id HEADER");
    }
    const user = await authServices.getmeService(userId);
    return successResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
};
