import { NextFunction, Request, Response, Router } from "express";
import * as attachmentController from "../controllers/media.controller";
import { error } from "node:console";
import { uploadImage } from "../middleware/upload.middleware";
import { AppError } from "shared";

const router = Router();

/**
 * checks whether the file is image or not
 * checks for errors and passes them to next
 * @param req
 * @param res
 * @param next
 */
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadImage(req, res, (err) => {
    if (!err) {
      return next();
    }
    if (err instanceof AppError) {
      return next(err);
    }

    if (
      typeof err === "object" &&
      err != null &&
      "code" in err &&
      err.code === "LIMIT_FILE_SIZE"
    ) {
      return next(new AppError(400, "FILE SIZE MUST BE OF 10MB OR LESS"));
    }
    return next(new AppError(400, "INVALID IMAGE UPLOAD"));
  });
};

router.post(
  "/:taskId/attachments",
  handleUpload,
  attachmentController.uploadAttachmentController,
);

router.get("/:taskId/attachments", attachmentController.listAttachments);
export default router;
