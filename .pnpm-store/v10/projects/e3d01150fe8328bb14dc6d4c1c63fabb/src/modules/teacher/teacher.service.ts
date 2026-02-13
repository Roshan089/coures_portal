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
import { UsersService } from '../users/users.service';
import { UserRole } from '../../shared/enum/user-roles';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherProfile)
    private readonly teacherProfileRepository: Repository<TeacherProfile>,
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
}
