import multer from "multer";
import { AppError } from "shared";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    console.log("FILE MIME TYPE:", file.mimetype);
    console.log("FILE ORIGINAL NAME:", file.originalname);
    // if (!file.mimetype.startsWith("image/")) {
    //   cb(new AppError(400, "ONLY IMAGE UPLOADS ARE ALLOWED"));
    //   return;
    // }
    cb(null, true);
  },
}).single("image");
