import { AppDataSource } from '../data-source';
import { ContactSettings } from '../../contact-settings/entities/contact-settings.entity';

/**
 * Seed script for creating initial contact settings
 * Run with: npm run seed:contacts
 */

async function seedContactSettings() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const settingsRepository = AppDataSource.getRepository(ContactSettings);

    // Check if settings already exist
    const existingSettings = await settingsRepository.findOne({
      where: {},
    });

    if (existingSettings) {
      console.log('Contact settings already exist. Skipping seed.');
      await AppDataSource.destroy();
      return;
    }

    // Create initial settings
    const settings = settingsRepository.create({
      phone: '+7 (999) 123-45-67',
      email: 'info@grafit.com',
      address: 'г. Москва, ул. Примерная, д. 1, офис 100',
    });

    await settingsRepository.save(settings);
    console.log('Contact settings created successfully!');
    console.log('Phone:', settings.phone);
    console.log('Email:', settings.email);
    console.log('Address:', settings.address);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

seedContactSettings();
