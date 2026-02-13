import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../../shared/enum/user-roles';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateStudentProfileDto) {
    const user = await this.usersService.getUserById(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role?.name !== UserRole.STUDENT) {
      throw new HttpException(
        'User must have role student to create a student profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.studentProfileRepository.findOne({
      where: { userId: dto.userId },
    });
    if (existing) {
      throw new HttpException(
        'Student profile already exists for this user',
        HttpStatus.CONFLICT,
      );
    }

    const profile = this.studentProfileRepository.create({
      userId: dto.userId,
      name: dto.name,
      bio: dto.bio ?? null,
      phone: dto.phone ?? null,
      profilePicUrl: dto.profilePicUrl ?? null,
      age: dto.age ?? null,
      isActive: dto.isActive ?? true,
    });
    return this.studentProfileRepository.save(profile);
  }

  async findAll() {
    const list = await this.studentProfileRepository.find({
      relations: ['user', 'user.role'],
      order: { createdAt: 'DESC' },
    });
    return list.map((p) => this.sanitizeProfile(p));
  }

  async findOne(id: string) {
    const profile = await this.studentProfileRepository.findOne({
      where: { id },
      relations: ['user', 'user.role'],
    });
    if (!profile) {
      throw new HttpException('Student profile not found', HttpStatus.NOT_FOUND);
    }
    return this.sanitizeProfile(profile);
  }

  async findByUserId(userId: string) {
    const profile = await this.studentProfileRepository.findOne({
      where: { userId },
      relations: ['user', 'user.role'],
    });
    if (!profile) {
      throw new HttpException('Student profile not found', HttpStatus.NOT_FOUND);
    }
    return this.sanitizeProfile(profile);
  }

  /** Returns the student profile for the given user id, or null if not found. Used by GET /profile/me. */
  async findOptionalByUserId(userId: string): Promise<StudentProfile | null> {
    return this.studentProfileRepository.findOne({
      where: { userId },
      relations: ['user', 'user.role'],
    });
  }

  sanitizeProfile(profile: StudentProfile) {
    if (profile.user && 'passwordHash' in profile.user) {
      const { passwordHash, ...user } = profile.user;
      return { ...profile, user };
    }
    return profile;
  }

  async update(id: string, dto: UpdateStudentProfileDto) {
    const profile = await this.studentProfileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new HttpException('Student profile not found', HttpStatus.NOT_FOUND);
    }

    if (dto.userId !== undefined) {
      const user = await this.usersService.getUserById(dto.userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.role?.name !== UserRole.STUDENT) {
        throw new HttpException(
          'User must have role student',
          HttpStatus.BAD_REQUEST,
        );
      }
      const existing = await this.studentProfileRepository.findOne({
        where: { userId: dto.userId },
      });
      if (existing && existing.id !== id) {
        throw new HttpException(
          'Student profile already exists for this user',
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
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });
    return this.studentProfileRepository.save(profile);
  }

  async remove(id: string) {
    const profile = await this.studentProfileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new HttpException('Student profile not found', HttpStatus.NOT_FOUND);
    }
    await this.studentProfileRepository.remove(profile);
  }
}
