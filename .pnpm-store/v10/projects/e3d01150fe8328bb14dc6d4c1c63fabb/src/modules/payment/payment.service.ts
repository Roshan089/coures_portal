import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { Emi } from './entities/emi.entity';
import { CourseAccess } from '../course-access/entities/course-access.entity';
import { Course } from '../course/entities/course.entity';
import { CourseService } from '../course/course.service';
import { StudentService } from '../student/student.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PayEmiDto } from './dto/pay-emi.dto';

interface RazorpayOrderResult {
  id: string;
}

@Injectable()
export class PaymentService {
  private razorpay: { 
    orders: { 
      create: (params: Record<string, unknown>) => Promise<RazorpayOrderResult>;
      fetch: (orderId: string) => Promise<{ amount: number }>;
    } 
  } | null = null;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Emi)
    private readonly emiRepository: Repository<Emi>,
    @InjectRepository(CourseAccess)
    private readonly courseAccessRepository: Repository<CourseAccess>,
    private readonly courseService: CourseService,
    private readonly studentService: StudentService,
    private readonly configService: ConfigService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (keyId && keySecret) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Razorpay = require('razorpay');
      this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
  }

  private ensureRazorpay(): { 
    orders: { 
      create: (params: Record<string, unknown>) => Promise<RazorpayOrderResult>;
      fetch: (orderId: string) => Promise<{ amount: number }>;
    };
  } {
    if (!this.razorpay) {
      throw new HttpException(
        'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return this.razorpay as { 
      orders: { 
        create: (params: Record<string, unknown>) => Promise<RazorpayOrderResult>;
        fetch: (orderId: string) => Promise<{ amount: number }>;
      };
    };
  }

  async createOrder(studentId: string, dto: CreateOrderDto) {
    const razorpay = this.ensureRazorpay();
    const course = await this.courseService.findOne(dto.courseId);
    await this.studentService.findOne(studentId);

    const amountRupees = parseFloat(course.price);
    if (amountRupees <= 0) {
      throw new HttpException(
        'Course has no price or is free.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Calculate payment amount: full amount for full payment, first EMI installment for EMI
    let paymentAmountRupees = amountRupees;
    let isEmiPayment = false;
    
    if (dto.useEmi === true && course.emiAllowed && course.emiCount && course.emiCount > 0) {
      // For EMI, charge only the first installment
      paymentAmountRupees = amountRupees / course.emiCount;
      isEmiPayment = true;
    }
    
    const amountPaise = Math.round(paymentAmountRupees * 100);

    const order = this.orderRepository.create({
      studentId,
      courseId: course.id,
      amount: course.price, // Store full course price in order
      razorpayOrderId: null,
      status: 'created',
    });
    const savedOrder = await this.orderRepository.save(order);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise, // Charge only first installment for EMI
      currency: 'INR',
      receipt: savedOrder.id,
      notes: { 
        orderId: savedOrder.id, 
        courseId: course.id,
        isEmi: isEmiPayment ? 'true' : 'false',
      },
    });

    savedOrder.razorpayOrderId = razorpayOrder.id;
    await this.orderRepository.save(savedOrder);

    // Only create EMI records if student explicitly chose EMI and course allows it
    if (dto.useEmi === true && course.emiAllowed && course.emiCount && course.emiCount > 0) {
      const emiAmount = (amountRupees / course.emiCount).toFixed(2);
      const dueDates: Date[] = [];
      const now = new Date();
      for (let i = 0; i < course.emiCount; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
        dueDates.push(d);
      }
      for (let i = 0; i < course.emiCount; i++) {
        const emi = this.emiRepository.create({
          orderId: savedOrder.id,
          installmentNumber: i + 1,
          dueDate: dueDates[i],
          amount: emiAmount,
          status: i === 0 ? 'pending' : 'pending', // First installment will be marked as paid after payment
        });
        await this.emiRepository.save(emi);
      }
    }

    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    return {
      orderId: savedOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: keyId ?? undefined,
    };
  }

  async getStudentEmis(studentId: string): Promise<Array<Emi & { order: Order; course: Course }>> {
    const orders = await this.orderRepository.find({
      where: { studentId, status: 'emi_active' },
      relations: ['course', 'emis'],
      order: { createdAt: 'DESC' },
    });

    const allEmis: Array<Emi & { order: Order; course: Course }> = [];
    for (const order of orders) {
      const emis = await this.emiRepository.find({
        where: { orderId: order.id },
        order: { installmentNumber: 'ASC' },
      });
      for (const emi of emis) {
        allEmis.push({
          ...emi,
          order,
          course: order.course,
        } as Emi & { order: Order; course: Course });
      }
    }

    return allEmis;
  }

  async createEmiPaymentOrder(studentId: string, dto: PayEmiDto) {
    const razorpay = this.ensureRazorpay();
    
    // Find the EMI record
    const emi = await this.emiRepository.findOne({
      where: { id: dto.emiId },
      relations: ['order'],
    });

    if (!emi) {
      throw new HttpException('EMI not found', HttpStatus.NOT_FOUND);
    }

    // Verify the order belongs to this student
    if (emi.order.studentId !== studentId) {
      throw new HttpException('EMI does not belong to this student', HttpStatus.FORBIDDEN);
    }

    // Check if EMI is already paid
    if (emi.status === 'paid') {
      throw new HttpException('EMI installment already paid', HttpStatus.BAD_REQUEST);
    }

    // Verify student exists
    await this.studentService.findOne(studentId);

    const amountPaise = Math.round(parseFloat(emi.amount) * 100);

    // Create a new Razorpay order for this EMI installment
    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `emi-${emi.id}`,
      notes: { 
        orderId: emi.orderId, 
        emiId: emi.id,
        installmentNumber: emi.installmentNumber.toString(),
      },
    });

    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    return {
      emiId: emi.id,
      orderId: emi.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: keyId ?? undefined,
    };
  }

  async verifyEmiPayment(dto: VerifyPaymentDto & { emiId?: string; razorpayOrderId?: string }) {
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!keySecret) {
      throw new HttpException(
        'Razorpay key secret not configured.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const razorpay = this.ensureRazorpay();
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId },
      relations: ['course'],
    });
    
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    // For 2nd+ EMI we create a new Razorpay order in pay-emi; signature is for that order, not the first one
    const razorpayOrderIdForSignature = dto.razorpayOrderId ?? order.razorpayOrderId;
    if (!razorpayOrderIdForSignature) {
      throw new HttpException('Order has no Razorpay order id', HttpStatus.BAD_REQUEST);
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpayOrderIdForSignature + '|' + dto.razorpayPaymentId)
      .digest('hex');
    if (expectedSignature !== dto.razorpaySignature) {
      throw new HttpException('Invalid payment signature', HttpStatus.BAD_REQUEST);
    }

    // Get the actual payment amount from the Razorpay order we just verified
    const razorpayOrderDetails = await razorpay.orders.fetch(razorpayOrderIdForSignature);
    const actualPaidAmount = razorpayOrderDetails.amount / 100;

    // Find the EMI record if emiId is provided
    if (dto.emiId) {
      const emi = await this.emiRepository.findOne({
        where: { id: dto.emiId },
      });

      if (!emi) {
        throw new HttpException('EMI not found', HttpStatus.NOT_FOUND);
      }

      if (emi.status === 'paid') {
        throw new HttpException('EMI installment already paid', HttpStatus.BAD_REQUEST);
      }

      // Mark EMI as paid
      emi.status = 'paid';
      emi.paidAt = new Date();
      await this.emiRepository.save(emi);

      // Create payment record
      const payment = this.paymentRepository.create({
        orderId: order.id,
        amount: actualPaidAmount.toFixed(2),
        razorpayPaymentId: dto.razorpayPaymentId,
        status: 'captured',
      });
      await this.paymentRepository.save(payment);

      // Check if all EMIs are paid
      const allEmis = await this.emiRepository.find({
        where: { orderId: order.id },
      });
      const allPaid = allEmis.every(e => e.status === 'paid');
      
      if (allPaid) {
        order.status = 'paid';
        await this.orderRepository.save(order);
      }

      // Ensure course access is active
      let access = await this.courseAccessRepository.findOne({
        where: { studentId: order.studentId, courseId: order.courseId },
      });
      if (access) {
        access.status = 'active';
        await this.courseAccessRepository.save(access);
      } else {
        access = this.courseAccessRepository.create({
          studentId: order.studentId,
          courseId: order.courseId,
          orderId: order.id,
          status: 'active',
        });
        await this.courseAccessRepository.save(access);
      }

      return {
        success: true,
        orderId: order.id,
        paymentId: payment.id,
        emiId: emi.id,
        allPaid,
      };
    }

    // Fallback to regular payment verification if no emiId
    return this.verifyPayment(dto);
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!keySecret) {
      throw new HttpException(
        'Razorpay key secret not configured.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const razorpay = this.ensureRazorpay();
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId },
      relations: ['course'],
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (order.status === 'paid' || order.status === 'emi_active') {
      throw new HttpException('Order already paid', HttpStatus.BAD_REQUEST);
    }
    if (!order.razorpayOrderId) {
      throw new HttpException('Order has no Razorpay order id', HttpStatus.BAD_REQUEST);
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(order.razorpayOrderId + '|' + dto.razorpayPaymentId)
      .digest('hex');
    if (expectedSignature !== dto.razorpaySignature) {
      throw new HttpException('Invalid payment signature', HttpStatus.BAD_REQUEST);
    }

    // Get the actual payment amount from Razorpay order (might be first EMI installment)
    const razorpayOrderDetails = await razorpay.orders.fetch(order.razorpayOrderId);
    const actualPaidAmount = razorpayOrderDetails.amount / 100; // Convert from paise to rupees

    const payment = this.paymentRepository.create({
      orderId: order.id,
      amount: actualPaidAmount.toFixed(2), // Store actual paid amount (first installment for EMI)
      razorpayPaymentId: dto.razorpayPaymentId,
      status: 'captured',
    });
    await this.paymentRepository.save(payment);

    // Check if this is an EMI payment (by checking if EMI records exist)
    const emiRecords = await this.emiRepository.find({
      where: { orderId: order.id },
      order: { installmentNumber: 'ASC' },
    });

    if (emiRecords.length > 0) {
      // This is an EMI payment - mark first installment as paid
      const firstEmi = emiRecords[0];
      firstEmi.status = 'paid';
      firstEmi.paidAt = new Date();
      await this.emiRepository.save(firstEmi);
      
      // Mark order as 'emi_active' to indicate EMI payment started
      order.status = 'emi_active';
    } else {
      // Full payment
      order.status = 'paid';
    }
    await this.orderRepository.save(order);

    let access = await this.courseAccessRepository.findOne({
      where: { studentId: order.studentId, courseId: order.courseId },
    });
    if (access) {
      access.status = 'active';
      access.orderId = order.id;
      await this.courseAccessRepository.save(access);
    } else {
      access = this.courseAccessRepository.create({
        studentId: order.studentId,
        courseId: order.courseId,
        orderId: order.id,
        status: 'active',
      });
      await this.courseAccessRepository.save(access);
    }

    return {
      success: true,
      orderId: order.id,
      paymentId: payment.id,
      courseAccessId: access.id,
    };
  }
}
