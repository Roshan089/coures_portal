import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherProfile } from './entities/teacher-profile.entity';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { UsersModule } from '../users/users.module';
import { CourseAccess } from '../course-access/entities/course-access.entity';
import { Course } from '../course/entities/course.entity';
import { Order } from '../payment/entities/order.entity';
import { Emi } from '../payment/entities/emi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeacherProfile, CourseAccess, Course, Order, Emi]),
    UsersModule,
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService, TypeOrmModule],
})
export class TeacherModule {}
