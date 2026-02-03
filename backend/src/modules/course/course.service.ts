import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { TeacherService } from '../teacher/teacher.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly teacherService: TeacherService,
  ) {}

  private sanitizeCourse(course: Course) {
    if (course.teacher?.user && 'passwordHash' in course.teacher.user) {
      const { passwordHash, ...user } = course.teacher.user;
      return { ...course, teacher: { ...course.teacher, user } };
    }
    return course;
  }

  async create(dto: CreateCourseDto) {
    await this.teacherService.findOne(dto.teacherId);

    const course = this.courseRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      teacherId: dto.teacherId,
      isPublished: dto.isPublished ?? false,
    });
    return this.courseRepository.save(course);
  }

  async findAll() {
    const list = await this.courseRepository.find({
      relations: ['teacher', 'teacher.user', 'teacher.user.role'],
      order: { createdAt: 'DESC' },
    });
    return list.map((c) => this.sanitizeCourse(c));
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['teacher', 'teacher.user', 'teacher.user.role'],
    });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    return this.sanitizeCourse(course);
  }

  async findByTeacherId(teacherId: string) {
    const list = await this.courseRepository.find({
      where: { teacherId },
      relations: ['teacher', 'teacher.user', 'teacher.user.role'],
      order: { createdAt: 'DESC' },
    });
    return list.map((c) => this.sanitizeCourse(c));
  }

  async update(id: string, dto: UpdateCourseDto) {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    if (dto.teacherId !== undefined) {
      await this.teacherService.findOne(dto.teacherId);
    }

    Object.assign(course, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.teacherId !== undefined && { teacherId: dto.teacherId }),
      ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
    });
    return this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    await this.courseRepository.remove(course);
  }
}
