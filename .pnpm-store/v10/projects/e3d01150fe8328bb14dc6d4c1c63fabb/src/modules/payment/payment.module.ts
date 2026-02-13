 import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { Emi } from './entities/emi.entity';
import { CourseAccess } from '../course-access/entities/course-access.entity';
import { CourseModule } from '../course/course.module';
import { StudentModule } from '../student/student.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentCronService } from './payment-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Payment, Emi, CourseAccess]),
    CourseModule,
    StudentModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentCronService],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
