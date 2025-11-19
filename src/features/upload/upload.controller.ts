import {
  Controller,
  Post,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadFiles } from 'src/interceptors/upload.interceptor';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UploadFiles('files', { destination: './uploads', maxCount: 10 })
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Bạn phải chọn ít nhất 1 ảnh!');
    }

    const savedFiles = await this.uploadService.createMany(files);

    return {
      message: 'Upload thành công',
      files: savedFiles.map((f) => ({
        id: f.id,
        url: `/uploads/${f.filename}`,
        mimetype: f.mimetype,
        size: f.size,
      })),
    };
  }
}
