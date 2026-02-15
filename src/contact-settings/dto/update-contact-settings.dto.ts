import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactSettingsDto {
  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+7 (999) 123-45-67',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Contact email',
    example: 'info@grafit.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Contact address',
    example: 'г. Москва, ул. Примерная, д. 1',
  })
  @IsString()
  @IsOptional()
  address?: string;
}
