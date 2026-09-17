import { NextFunction, Request, Response } from "express";
import { AppError, successResponse } from "shared";
import * as attachmentService from "../services/media.services";

function requireIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!userId || !role) {
    throw new AppError(401, "MISSING USER IDENTITY");
  }

  return {
    userId,
    role,
  };
}

export const uploadAttachmentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = requireIdentity(req);
    const taskId = String(req.params.taskId);
    const attachment = await attachmentService.uploadAttachmentService({
      taskId,
      userId,
      role,
      file: req.file,
    });
    successResponse(res, { attachment }, 201);
  } catch (error) {
    next(error);
  }
};

export const listAttachments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, role } = requireIdentity(req);
  try {
    const taskId = String(req.params.taskId);

    // console.log(taskId);

    const extractAttachments = await attachmentService.listAttachmentService(
      taskId,
      userId,
      role,
    );

    // console.log(extractAttachments);

    successResponse(res, { extractAttachments }, 200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
