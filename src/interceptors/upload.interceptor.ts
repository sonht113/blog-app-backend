import { UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export type UploadOptions = {
  destination?: string; // relative path
  maxCount?: number;
  maxFileSize?: number; // bytes
  allowedMime?: RegExp;
  filenamePrefix?: string;
};

interface FileFilterRequest {
  [key: string]: any;
}

interface FileFilterFile {
  mimetype: string;
  [key: string]: any;
}

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

export function UploadFiles(field = 'files', opts: UploadOptions = {}) {
  const {
    destination = './uploads',
    maxCount = 10,
    maxFileSize = 5 * 1024 * 1024,
    allowedMime = /\/(jpg|jpeg|png|webp|gif)$/,
    filenamePrefix = '',
  } = opts;

  const storage = diskStorage({
    destination: (req, file, cb) => {
      try {
        fs.mkdirSync(destination, { recursive: true });
      } catch {
        // ignore if already exists
      }
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${filenamePrefix}${unique}${ext}`);
    },
  });

  const fileFilter = (
    _req: FileFilterRequest,
    file: FileFilterFile,
    cb: FileFilterCallback,
  ) => {
    if (!file.mimetype.match(allowedMime)) {
      return cb(
        new BadRequestException(
          'Only images allowed (jpg, jpeg, png, webp, gif).',
        ),
        false,
      );
    }
    cb(null, true);
  };

  const limits = { fileSize: maxFileSize };

  return UseInterceptors(
    FilesInterceptor(field, maxCount, { storage, fileFilter, limits }),
  );
}
