import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Modern Villa' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'modern-villa' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'A beautiful modern villa with stunning architecture' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Modern villa design' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'ABC Company' })
  @IsString()
  @IsOptional()
  client?: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ example: 'Moscow, Russia' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: '250 sq.m' })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiPropertyOptional({ example: '/uploads/projects/cover.jpg' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ example: ['/uploads/projects/img1.jpg', '/uploads/projects/img2.jpg'] })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
