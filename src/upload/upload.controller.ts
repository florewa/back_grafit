import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload single image (Admin/Editor)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          example: 'projects',
          description: 'Folder name (projects or pages)',
        },
      },
      required: ['file', 'folder'],
    },
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string = 'projects',
  ) {
    return this.uploadService.uploadImage(file, folder);
  }

  @Post('images')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple images (Admin/Editor, max 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        folder: {
          type: 'string',
          example: 'projects',
          description: 'Folder name (projects or pages)',
        },
      },
      required: ['files', 'folder'],
    },
  })
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder: string = 'projects',
  ) {
    return this.uploadService.uploadMultipleImages(files, folder);
  }

  @Delete()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete file (Admin/Editor)' })
  async removeFile(@Body('filePath') filePath: string) {
    await this.uploadService.removeFile(filePath);
  }
}
