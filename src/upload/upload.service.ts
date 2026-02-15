import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor() {
    // Ensure upload directories exist
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    const dirs = [
      this.uploadPath,
      join(this.uploadPath, 'projects'),
      join(this.uploadPath, 'pages'),
      join(this.uploadPath, 'thumbnails'),
    ];

    dirs.forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed',
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filepath = join(this.uploadPath, folder, filename);

    // Save original file
    await sharp(file.buffer).toFile(filepath);

    // Generate thumbnail
    const thumbnailPath = await this.generateThumbnail(
      filepath,
      folder,
      filename,
    );

    return {
      url: `/uploads/${folder}/${filename}`,
      thumbnail: thumbnailPath,
      filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async generateThumbnail(
    filepath: string,
    folder: string,
    filename: string,
  ): Promise<string> {
    const thumbnailFilename = `thumb-${filename}`;
    const thumbnailPath = join(this.uploadPath, 'thumbnails', thumbnailFilename);

    await sharp(filepath)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center',
      })
      .toFile(thumbnailPath);

    return `/uploads/thumbnails/${thumbnailFilename}`;
  }

  async removeFile(filePath: string): Promise<void> {
    // Remove leading slash and 'uploads/' from path
    const cleanPath = filePath.replace(/^\/uploads\//, '');
    const fullPath = join(this.uploadPath, cleanPath);

    if (existsSync(fullPath)) {
      unlinkSync(fullPath);

      // Try to remove thumbnail if exists
      const filename = cleanPath.split('/').pop();
      const thumbnailPath = join(
        this.uploadPath,
        'thumbnails',
        `thumb-${filename}`,
      );

      if (existsSync(thumbnailPath)) {
        unlinkSync(thumbnailPath);
      }
    }
  }
}
