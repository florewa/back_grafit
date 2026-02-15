import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContactSettingsService } from './contact-settings.service';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Contact Settings')
@Controller('contact-settings')
export class ContactSettingsController {
  constructor(
    private readonly contactSettingsService: ContactSettingsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get contact settings (public)' })
  async get() {
    return this.contactSettingsService.get();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact settings (Admin/Editor)' })
  async update(@Body() updateDto: UpdateContactSettingsDto) {
    return this.contactSettingsService.update(updateDto);
  }
}
