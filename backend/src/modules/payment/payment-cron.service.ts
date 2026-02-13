import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Emi } from './entities/emi.entity';
import { Order } from './entities/order.entity';
import { CourseAccess } from '../course-access/entities/course-access.entity';

@Injectable()
export class PaymentCronService {
  private readonly logger = new Logger(PaymentCronService.name);

  constructor(
    @InjectRepository(Emi)
    private readonly emiRepository: Repository<Emi>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(CourseAccess)
    private readonly courseAccessRepository: Repository<CourseAccess>,
  ) {}

  /**
   * Runs daily at 2 AM to check for overdue EMIs and suspend course access
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleOverdueEmis() {
    this.logger.log('Starting overdue EMI check...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueEmis = await this.emiRepository.find({
      where: {
        status: 'pending',
        dueDate: LessThan(today),
      },
      relations: ['order'],
    });

    if (overdueEmis.length === 0) {
      this.logger.log('No overdue EMIs found.');
      return;
    }

    this.logger.log(`Found ${overdueEmis.length} overdue EMI(s)`);

    for (const emi of overdueEmis) {
      emi.status = 'overdue';
      await this.emiRepository.save(emi);
      this.logger.log(`Marked EMI ${emi.id} (Order: ${emi.orderId}, Installment: ${emi.installmentNumber}) as overdue`);
    }

    const orderIds = [...new Set(overdueEmis.map((emi) => emi.orderId))];
    this.logger.log(`Checking course access for ${orderIds.length} order(s) with overdue EMIs`);

    for (const orderId of orderIds) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        this.logger.warn(`Order ${orderId} not found`);
        continue;
      }

      const access = await this.courseAccessRepository.findOne({
        where: {
          studentId: order.studentId,
          courseId: order.courseId,
        },
      });

      if (access && access.status === 'active') {
        access.status = 'suspended';
        await this.courseAccessRepository.save(access);
        this.logger.log(
          `Suspended course access for student ${order.studentId}, course ${order.courseId} (Order: ${orderId})`,
        );
      }
    }

    this.logger.log('Overdue EMI check completed.');
  }
}
