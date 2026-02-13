import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseAccess } from '../entities/course-access.entity';
import { StudentService } from '../../student/student.service';
import { CourseVideo } from '../../course/entities/course-video.entity';
import { Course } from '../../course/entities/course.entity';
import { TeacherProfile } from '../../teacher/entities/teacher-profile.entity';
import { UserRole } from '../../../shared/enum/user-roles';

@Injectable()
export class RequireCourseAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(CourseAccess)
    private readonly courseAccessRepository: Repository<CourseAccess>,
    @InjectRepository(CourseVideo)
    private readonly courseVideoRepository: Repository<CourseVideo>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(TeacherProfile)
    private readonly teacherProfileRepository: Repository<TeacherProfile>,
    private readonly studentService: StudentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as { sub?: string; role?: string } | undefined;

    if (!user?.sub) {
      throw new ForbiddenException('User not authenticated');
    }

    let courseId: string | undefined;

    const params = request.params as Record<string, string>;
    if (params.courseId) {
      courseId = params.courseId;
    } else if (params.id) {
      const routePath = request.route?.path || '';
      if (routePath.includes('/videos/')) {
        const video = await this.courseVideoRepository.findOne({
          where: { id: params.id },
        });
        if (!video) {
          throw new NotFoundException('Course video not found');
        }
        courseId = video.courseId;
      } else {
        courseId = params.id;
      }
    }

    if (!courseId) {
      throw new ForbiddenException('Course ID not found in request');
    }

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['teacher'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.price === '0' || parseFloat(course.price) === 0) {
      return true;
    }

    if (user.role === UserRole.TEACHER) {
      const teacherProfile = await this.teacherProfileRepository.findOne({
        where: { userId: user.sub },
      });
      if (teacherProfile && teacherProfile.id === course.teacherId) {
        return true;
      }
    }

    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Only students can access paid courses');
    }

    const studentProfile = await this.studentService.findOptionalByUserId(user.sub);
    if (!studentProfile) {
      throw new ForbiddenException('Student profile not found');
    }

    const access = await this.courseAccessRepository.findOne({
      where: {
        studentId: studentProfile.id,
        courseId,
      },
    });

    if (!access) {
      throw new ForbiddenException('You do not have access to this course. Please purchase it first.');
    }

    if (access.status !== 'active') {
      throw new ForbiddenException(
        `Your access to this course is ${access.status}. Please contact support if you believe this is an error.`,
      );
    }

    return true;
  }
}
