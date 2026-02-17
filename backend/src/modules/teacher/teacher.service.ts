import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherProfile } from './entities/teacher-profile.entity';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { UpdateStudentAccessStatusDto } from './dto/update-student-access-status.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../../shared/enum/user-roles';
import { CourseAccess } from '../course-access/entities/course-access.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherProfile)
    private readonly teacherProfileRepository: Repository<TeacherProfile>,
    @InjectRepository(CourseAccess)
    private readonly courseAccessRepository: Repository<CourseAccess>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateTeacherProfileDto) {
    const user = await this.usersService.getUserById(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role?.name !== UserRole.TEACHER) {
      throw new HttpException(
        'User must have role teacher to create a teacher profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.teacherProfileRepository.findOne({
      where: { userId: dto.userId },
    });
    if (existing) {
      throw new HttpException(
        'Teacher profile already exists for this user',
        HttpStatus.CONFLICT,
      );
    }

    const profile = this.teacherProfileRepository.create({
      userId: dto.userId,
      name: dto.name,
      bio: dto.bio ?? null,
      phone: dto.phone ?? null,
      profilePicUrl: dto.profilePicUrl ?? null,
      age: dto.age ?? null,
      isApproved: dto.isApproved ?? false,
    });
    return this.teacherProfileRepository.save(profile);
  }

  async findAll() {
    const list = await this.teacherProfileRepository.find({
      relations: ['user', 'user.role'],
      order: { createdAt: 'DESC' },
    });
    return list.map((p) => this.sanitizeProfile(p));
  }

  async findOne(id: string) {
    const profile = await this.teacherProfileRepository.findOne({
      where: { id },
      relations: ['user', 'user.role'],
    });
    if (!profile) {
      throw new HttpException('Teacher profile not found', HttpStatus.NOT_FOUND);
    }
    return this.sanitizeProfile(profile);
  }

  async findByUserId(userId: string) {
    const profile = await this.teacherProfileRepository.findOne({
      where: { userId },
      relations: ['user', 'user.role'],
    });
    if (!profile) {
      throw new HttpException('Teacher profile not found', HttpStatus.NOT_FOUND);
    }
    return this.sanitizeProfile(profile);
  }

  /** Returns the teacher profile for the given user id, or null if not found. Used by GET /profile/me. */
  async findOptionalByUserId(userId: string): Promise<TeacherProfile | null> {
    return this.teacherProfileRepository.findOne({
      where: { userId },
      relations: ['user', 'user.role'],
    });
  }

  sanitizeProfile(profile: TeacherProfile) {
    if (profile.user && 'passwordHash' in profile.user) {
      const { passwordHash, ...user } = profile.user;
      return { ...profile, user };
    }
    return profile;
  }

  async update(id: string, dto: UpdateTeacherProfileDto) {
    const profile = await this.teacherProfileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new HttpException('Teacher profile not found', HttpStatus.NOT_FOUND);
    }

    if (dto.userId !== undefined) {
      const user = await this.usersService.getUserById(dto.userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.role?.name !== UserRole.TEACHER) {
        throw new HttpException(
          'User must have role teacher',
          HttpStatus.BAD_REQUEST,
        );
      }
      const existing = await this.teacherProfileRepository.findOne({
        where: { userId: dto.userId },
      });
      if (existing && existing.id !== id) {
        throw new HttpException(
          'Teacher profile already exists for this user',
          HttpStatus.CONFLICT,
        );
      }
    }

    Object.assign(profile, {
      ...(dto.userId !== undefined && { userId: dto.userId }),
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.profilePicUrl !== undefined && { profilePicUrl: dto.profilePicUrl }),
      ...(dto.age !== undefined && { age: dto.age }),
      ...(dto.isApproved !== undefined && { isApproved: dto.isApproved }),
    });
    return this.teacherProfileRepository.save(profile);
  }

  async remove(id: string) {
    const profile = await this.teacherProfileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new HttpException('Teacher profile not found', HttpStatus.NOT_FOUND);
    }
    await this.teacherProfileRepository.remove(profile);
  }

  /**
   * Get students enrolled in the teacher's courses, with optional filters.
   * Returns course-wise enrollments with payment/order/EMI details.
   */
  async getTeacherStudents(
    teacherId: string,
    filters?: { courseId?: string; status?: string },
  ) {
    const where: { course: { teacherId: string; id?: string }; status?: string } = {
      course: { teacherId },
    };
    if (filters?.courseId) where.course.id = filters.courseId;
    if (filters?.status) where.status = filters.status;

    const accessRecords = await this.courseAccessRepository.find({
      where,
      relations: [
        'student',
        'student.user',
        'course',
        'order',
        'order.emis',
      ],
      order: { createdAt: 'DESC' },
    });

    return accessRecords.map((access) => {
      const student = access.student;
      const user = student?.user;
      const sanitizedStudent = user && 'passwordHash' in user
        ? { ...student, user: { id: user.id, email: user.email, role: user.role } }
        : student;
      const order = access.order;
      return {
        courseAccessId: access.id,
        student: sanitizedStudent
          ? { id: sanitizedStudent.id, name: sanitizedStudent.name, user: sanitizedStudent.user }
          : null,
        course: access.course
          ? { id: access.course.id, title: access.course.title }
          : null,
        accessStatus: access.status,
        enrolledAt: access.createdAt,
        order: order
          ? {
              id: order.id,
              amount: order.amount,
              status: order.status,
              createdAt: order.createdAt,
              emis:
                order.emis?.map((e) => ({
                  id: e.id,
                  installmentNumber: e.installmentNumber,
                  dueDate: e.dueDate,
                  amount: e.amount,
                  status: e.status,
                  paidAt: e.paidAt,
                })) ?? [],
            }
          : null,
      };
    });
  }

  /**
   * Teacher manually updates a student's course access status (e.g. suspend for rule violation).
   * Only allowed for enrollments in the teacher's own courses.
   */
  async updateStudentAccessStatus(
    teacherId: string,
    courseAccessId: string,
    dto: UpdateStudentAccessStatusDto,
  ) {
    const access = await this.courseAccessRepository.findOne({
      where: { id: courseAccessId },
      relations: ['course'],
    });
    if (!access) {
      throw new HttpException('Course access record not found', HttpStatus.NOT_FOUND);
    }
    if (access.course.teacherId !== teacherId) {
      throw new HttpException('You can only update access for your own course enrollments', HttpStatus.FORBIDDEN);
    }
    access.status = dto.status;
    await this.courseAccessRepository.save(access);
    return { courseAccessId: access.id, status: access.status };
  }
}
