import { NextFunction, Request, Response } from "express";
import * as taskService from "../services/task.service";
import { AppError, successResponse } from "shared";

const requireIdentity = (req: Request) => {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!role || !userId) {
    throw new AppError(401, "MISSING USER IDENTITY");
  }
  if (typeof userId !== "string") {
    throw new AppError(401, "Invalid user ID");
  }
  return {
    userId,
    role,
  };
};
export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = requireIdentity(req);
    const newTask = await taskService.createTask(req.body, userId);
    successResponse(res, newTask, 201);
  } catch (error) {
    throw new AppError(500, "ERROR WHILE CREATING TASK");
  }
};

export const listTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = requireIdentity(req);
    const tasks = await taskService.listTaskService(userId, role);
    successResponse(res, { tasks }, 200);
  } catch (error) {
    next(error);
  }
};

export const getSingleTaskController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = requireIdentity(req);
    const id = String(req.params.id);
    const task = taskService.getSingleTaskService(id, userId, role);
    successResponse(res, { task }, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteSingleTask = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role } = requireIdentity(req);
    const id = String(req.params.id);
    const deletedResult = taskService.deleteTaskService(id, role);
    successResponse(res, deletedResult, 200);
  } catch (error) {
    next(error);
  }
};
