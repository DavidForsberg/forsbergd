"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFilesystem = void 0;
const multer_1 = __importDefault(require("multer"));
const fs = require("fs");
const fileStorageEngine = multer_1.default.diskStorage({
    destination: (req, _, cb) => {
        const path = "./public/" + req.body.filepath;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const initFilesystem = () => (0, multer_1.default)({ storage: fileStorageEngine });
exports.initFilesystem = initFilesystem;
//# sourceMappingURL=uploadfiles.js.map