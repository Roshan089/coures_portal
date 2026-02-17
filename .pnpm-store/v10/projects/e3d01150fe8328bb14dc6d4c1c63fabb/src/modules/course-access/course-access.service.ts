import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseAccess } from './entities/course-access.entity';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class CourseAccessService {
  constructor(
    @InjectRepository(CourseAccess)
    private readonly courseAccessRepository: Repository<CourseAccess>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  /** Returns all course access records for the student (active, suspended, revoked) so they appear in My Courses. */
  async getStudentCourses(studentId: string) {
    const accessRecords = await this.courseAccessRepository.find({
      where: { studentId },
      relations: ['course', 'course.teacher', 'course.teacher.user'],
      order: { createdAt: 'DESC' },
    });

    return accessRecords.map((access) => {
      const course = access.course;
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        teacher: course.teacher
          ? {
              id: course.teacher.id,
              name: course.teacher.name,
            }
          : null,
        price: course.price,
        emiAllowed: course.emiAllowed,
        emiCount: course.emiCount,
        isPublished: course.isPublished,
        accessStatus: access.status,
        purchasedAt: access.createdAt,
      };
    });
  }
}
