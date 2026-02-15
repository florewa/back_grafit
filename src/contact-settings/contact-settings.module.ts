import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactSettingsService } from './contact-settings.service';
import { ContactSettingsController } from './contact-settings.controller';
import { ContactSettings } from './entities/contact-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSettings])],
  providers: [ContactSettingsService],
  controllers: [ContactSettingsController],
  exports: [ContactSettingsService],
})
export class ContactSettingsModule {}
