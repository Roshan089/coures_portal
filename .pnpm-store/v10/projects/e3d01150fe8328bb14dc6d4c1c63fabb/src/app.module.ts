import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { StudentModule } from './modules/student/student.module';
import { RolesModule } from './modules/roles/roles.module';
import { CourseModule } from './modules/course/course.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CourseAccessModule } from './modules/course-access/course-access.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    AdminModule,
    TeacherModule,
    StudentModule,
    RolesModule,
    CourseModule,
    PaymentModule,
    CourseAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
