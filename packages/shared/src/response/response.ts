import { Response } from "express";

export const successResponse = (
  res: Response,
  data: unknown,
  statusCode: number,
) => {
  return res.status(statusCode).json({
    sucess: true,
    data,
  });
};

export const failResponse = (
  res: Response,
  data: unknown,
  statusCode: number = 400,
) => {
  return res.status(statusCode).json({
    sucess: false,
    data,
  });
};
