import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseVideo } from './entities/course-video.entity';
import { CourseService } from './course.service';
import { CourseVideoService } from './course-video.service';
import { CourseController } from './course.controller';
import { TeacherModule } from '../teacher/teacher.module';
import { CourseAccessModule } from '../course-access/course-access.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseVideo]),
    TeacherModule,
    StudentModule,
    forwardRef(() => CourseAccessModule),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseVideoService],
  exports: [CourseService, CourseVideoService, TypeOrmModule],
})
export class CourseModule {}
