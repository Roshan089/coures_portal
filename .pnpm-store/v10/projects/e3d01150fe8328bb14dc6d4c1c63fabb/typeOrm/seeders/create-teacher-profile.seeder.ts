import { DataSource } from 'typeorm';
import { User } from '../../src/modules/users/entities/user.entity';
import { TeacherProfile } from '../../src/modules/teacher/entities/teacher-profile.entity';
import { getDatabaseConfig } from '../config';

/**
 * Seeder: Create Teacher Profile for teacher@courseportal.com
 *
 * Run with: pnpm seed:teacher-profile
 * Order: Run after seed:users (teacher user must exist).
 */

const TEACHER_EMAIL = 'teacher@courseportal.com';

async function seedTeacherProfile() {
  const dataSource = new DataSource({
    ...getDatabaseConfig(),
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = dataSource.getRepository(User);
    const teacherProfileRepository = dataSource.getRepository(TeacherProfile);

    const teacherUser = await userRepository.findOne({
      where: { email: TEACHER_EMAIL },
      relations: ['role'],
    });

    if (!teacherUser) {
      throw new Error(
        `User ${TEACHER_EMAIL} not found. Run: pnpm seed:users`,
      );
    }

    const existing = await teacherProfileRepository.findOne({
      where: { userId: teacherUser.id },
    });
    if (existing) {
      console.log('⚠️  Teacher profile already exists. Skipping seeder.');
      return;
    }

    const teacherProfile = teacherProfileRepository.create({
      userId: teacherUser.id,
      name: 'Jane Teacher',
      bio: 'Mathematics teacher',
      phone: '+1234567890',
      profilePicUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
      age: 35,
      isApproved: true,
    });
    await teacherProfileRepository.save(teacherProfile);

    console.log('✅ Teacher profile created for', TEACHER_EMAIL);
  } catch (error) {
    console.error('❌ Error running seeder:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('✅ Database connection closed');
  }
}

if (require.main === module) {
  seedTeacherProfile()
    .then(() => {
      console.log('✅ Seeder finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeder failed:', error);
      process.exit(1);
    });
}

export { seedTeacherProfile };
