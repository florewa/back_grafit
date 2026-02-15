import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSettings } from './entities/contact-settings.entity';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';

@Injectable()
export class ContactSettingsService {
  constructor(
    @InjectRepository(ContactSettings)
    private readonly settingsRepository: Repository<ContactSettings>,
  ) {}

  /**
   * Get contact settings (creates default if not exists)
   */
  async get(): Promise<ContactSettings> {
    let settings = await this.settingsRepository.findOne({
      where: {},
    });

    // Create default settings if not exists
    if (!settings) {
      settings = this.settingsRepository.create({
        phone: null,
        email: null,
        address: null,
      });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }

  /**
   * Update contact settings
   */
  async update(
    updateDto: UpdateContactSettingsDto,
  ): Promise<ContactSettings> {
    const settings = await this.get();
    Object.assign(settings, updateDto);
    return this.settingsRepository.save(settings);
  }
}
