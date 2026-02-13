import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseAccess } from './entities/course-access.entity';
import { CourseVideo } from '../course/entities/course-video.entity';
import { Course } from '../course/entities/course.entity';
import { TeacherProfile } from '../teacher/entities/teacher-profile.entity';
import { StudentModule } from '../student/student.module';
import { RequireCourseAccessGuard } from './guards/require-course-access.guard';
import { CourseAccessService } from './course-access.service';
import { CourseAccessController } from './course-access.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseAccess, CourseVideo, Course, TeacherProfile]),
    StudentModule,
  ],
  controllers: [CourseAccessController],
  providers: [RequireCourseAccessGuard, CourseAccessService],
  exports: [TypeOrmModule, RequireCourseAccessGuard, CourseAccessService],
})
export class CourseAccessModule {}
