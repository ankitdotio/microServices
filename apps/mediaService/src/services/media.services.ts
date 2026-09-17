import { AppError } from "shared";
import * as attachmentRepo from "../repositories/media.repository";
import { uploadBuffer } from "../utils/storage";
import { converToPublicMediaAttachment } from "../utils/media.utils";

const assertTaskAccess = async (
  taskId: string,
  userId: string,
  role: string,
) => {
  const task = await attachmentRepo.findTaskAccess(taskId);
  if (!task) {
    throw new AppError(404, "TASK NOT FOUND");
  }
  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(403, "FORBIDDEN");
  }
};
export const uploadAttachmentService = async (input: {
  taskId: string;
  userId: string;
  role: string;
  file?: Express.Multer.File;
}) => {
  if (!input.file) {
    throw new AppError(400, "IMAGE FILE IS REQUIRED");
  }

  await assertTaskAccess(input.taskId, input.userId, input.role);

  const uploaded = await uploadBuffer(input.file.buffer, "image/jpeg");

  const attachment = await attachmentRepo.createAttachment({
    taskId: input.taskId,
    imageUrl: uploaded.imageUrl,
    publicId: uploaded.publicId,
    uploadedBy: input.userId,
  });

  return converToPublicMediaAttachment(attachment);
};

export const listAttachmentService = async (
  taskId: string,
  userId: string,
  role: string,
) => {
  await assertTaskAccess(taskId, userId, role);
  const list = await attachmentRepo.listByTaskId(taskId);

  return list.map(converToPublicMediaAttachment);
};
