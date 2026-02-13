import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';
import { User } from '../../src/modules/users/entities/user.entity';
import { Role } from '../../src/modules/roles/entities/role.entity';
import { UserRole } from '../../src/shared/enum/user-roles';
import { getDatabaseConfig } from '../config';

/**
 * Seeder: Create Users for All Roles
 *
 * Fetches role IDs from the `roles` table, then creates:
 * - Admin user
 * - Teacher user
 * - Student user
 *
 * Run with: pnpm seed:users
 * Order: Run after migration:run (roles are seeded inside the migration).
 * Then run pnpm seed:teacher-profile to add teacher profile.
 */

async function seedUsers() {
  const dataSource = new DataSource({
    ...getDatabaseConfig(),
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    // 1. Fetch role IDs from roles table (like the Sequelize pattern)
    const roles = await roleRepository.find();
    const adminRole = roles.find((r) => r.name === UserRole.ADMIN);
    const teacherRole = roles.find((r) => r.name === UserRole.TEACHER);
    const studentRole = roles.find((r) => r.name === UserRole.STUDENT);

    if (!adminRole || !teacherRole || !studentRole) {
      throw new Error(
        'Required roles (admin, teacher, student) are missing. Run: pnpm migration:run',
      );
    }

    // 2. Skip if users already exist
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('⚠️  Users already exist. Skipping seeder.');
      return;
    }

    const defaultPassword = 'password123';
    const hashedPassword = await hash(defaultPassword, 10);

    // 3. Create users with role_id (FK to roles)
    const adminUser = userRepository.create({
      email: 'admin@courseportal.com',
      passwordHash: hashedPassword,
      roleId: adminRole.id,
      isVerified: true,
    });

    const teacherUser = userRepository.create({
      email: 'teacher@courseportal.com',
      passwordHash: hashedPassword,
      roleId: teacherRole.id,
      isVerified: true,
    });

    const studentUser = userRepository.create({
      email: 'student@courseportal.com',
      passwordHash: hashedPassword,
      roleId: studentRole.id,
      isVerified: true,
    });

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
    await dataSource.destroy();
    console.log('✅ Database connection closed');
  }
}

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
