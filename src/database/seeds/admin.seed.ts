import { AppDataSource } from '../data-source';

/**
 * Seed script for creating initial admin user
 * Run with: ts-node src/database/seeds/admin.seed.ts
 *
 * Note: This will be properly implemented after User entity is created in Phase 1.3
 */

async function seedAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // TODO: Implement admin user creation after User entity is ready
    // const userRepository = AppDataSource.getRepository(User);
    // const hashedPassword = await bcrypt.hash('admin123', 10);
    // const admin = userRepository.create({
    //   email: 'admin@grafit.com',
    //   password: hashedPassword,
    //   name: 'Admin',
    //   role: UserRole.ADMIN,
    // });
    // await userRepository.save(admin);

    console.log('Admin user seed will be implemented in Phase 1.3');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

seedAdmin();
