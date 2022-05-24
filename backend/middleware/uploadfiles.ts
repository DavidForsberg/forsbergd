import multer from "multer";
import { Request } from "express";
import { DestinationCallback, FileNameCallback } from "types";
const fs = require("fs");

// Multer init
const fileStorageEngine = multer.diskStorage({
  destination: (
    req: Request<{}, {}, { filepath: string }>,
    _: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    const path = "./public/" + req.body.filepath;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (_: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, file.originalname);
  },
});

export const initFilesystem = () => multer({ storage: fileStorageEngine });
