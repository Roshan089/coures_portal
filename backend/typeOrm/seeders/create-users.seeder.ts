import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';
import { User } from '../../src/modules/users/entities/user.entity';
import { UserRole } from '../../src/shared/enum/user-roles';
import { getDatabaseConfig } from '../config';

/**
 * Seeder: Create Users for All Roles
 * 
 * This seeder creates three users:
 * - Admin user
 * - Teacher user
 * - Student user
 * 
 * Run with: ts-node typeOrm/seeders/create-users.seeder.ts
 */

async function seedUsers() {
  // Create DataSource connection
  const dataSource = new DataSource({
    ...getDatabaseConfig(),
    synchronize: false,
  });

  try {
    // Initialize connection
    await dataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = dataSource.getRepository(User);

    // Default password for all users (change in production!)
    const defaultPassword = 'password123';
    const hashedPassword = await hash(defaultPassword, 10);

    // Check if users already exist
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('⚠️  Users already exist. Skipping seeder.');
      await dataSource.destroy();
      return;
    }

    // Create Admin User
    const adminUser = userRepository.create({
      email: 'admin@courseportal.com',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true,
    });

    // Create Teacher User
    const teacherUser = userRepository.create({
      email: 'teacher@courseportal.com',
      passwordHash: hashedPassword,
      role: UserRole.TEACHER,
      isVerified: true,
    });

    // Create Student User
    const studentUser = userRepository.create({
      email: 'student@courseportal.com',
      passwordHash: hashedPassword,
      role: UserRole.STUDENT,
      isVerified: true,
    });

    // Save all users
    await userRepository.save([adminUser, teacherUser, studentUser]);

    console.log('✅ Seeder completed successfully!');
    console.log('\n📋 Created users:');
    console.log('   👤 Admin:   admin@courseportal.com / password123');
    console.log('   👨‍🏫 Teacher: teacher@courseportal.com / password123');
    console.log('   👨‍🎓 Student: student@courseportal.com / password123');
    console.log('\n⚠️  Remember to change passwords in production!');

  } catch (error) {
    console.error('❌ Error running seeder:', error);
    throw error;
  } finally {
    // Close connection
    await dataSource.destroy();
    console.log('✅ Database connection closed');
  }
}

// Run seeder if executed directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('✅ Seeder finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeder failed:', error);
      process.exit(1);
    });
}

export { seedUsers };
