import { AppDataSource } from '../data-source';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

/**
 * Seed script for creating initial admin user
 * Run with: npm run seed:admin
 */

async function seedAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@grafit.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seed.');
      await AppDataSource.destroy();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = userRepository.create({
      email: 'admin@grafit.com',
      password: hashedPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
    });

    await userRepository.save(admin);
    console.log('Admin user created successfully!');
    console.log('Email: admin@grafit.com');
    console.log('Password: admin123');
    console.log('IMPORTANT: Change this password in production!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

seedAdmin();
