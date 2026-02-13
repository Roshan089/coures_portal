import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { StudentService } from '../student/student.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PayEmiDto } from './dto/pay-emi.dto';

@ApiTags('payment')
@Controller('payment')
@ApiBearerAuth('JWT-auth')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly studentService: StudentService,
  ) {}

  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a payment order for a course' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully. Returns order details for Razorpay checkout.',
  })
  @ApiResponse({ status: 400, description: 'Course has no price or is free' })
  @ApiResponse({ status: 404, description: 'Course or student not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - student profile not found' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: CreateOrderDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }

    const studentProfile = await this.studentService.findByUserId(userId);
    if (!studentProfile) {
      throw new HttpException('Student profile not found for this user', HttpStatus.NOT_FOUND);
    }

    return this.paymentService.createOrder(studentProfile.id, dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify payment after Razorpay checkout success' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully. Course access granted.',
  })
  @ApiResponse({ status: 400, description: 'Invalid payment signature or order already paid' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: VerifyPaymentDto })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(dto);
  }

  @Post('emis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all pending EMIs for the logged-in student' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of pending EMIs',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - student profile not found' })
  async getStudentEmis(@Req() req: { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }

    const studentProfile = await this.studentService.findByUserId(userId);
    if (!studentProfile) {
      throw new HttpException('Student profile not found for this user', HttpStatus.NOT_FOUND);
    }

    return this.paymentService.getStudentEmis(studentProfile.id);
  }

  @Post('pay-emi')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a payment order for an EMI installment' })
  @ApiResponse({
    status: 201,
    description: 'EMI payment order created successfully. Returns order details for Razorpay checkout.',
  })
  @ApiResponse({ status: 400, description: 'EMI already paid' })
  @ApiResponse({ status: 404, description: 'EMI not found' })
  @ApiResponse({ status: 403, description: 'EMI does not belong to this student' })
  @ApiResponse({ status: 401, description: 'Unauthorized - student profile not found' })
  @ApiBody({ type: PayEmiDto })
  async payEmi(
    @Req() req: { user?: { sub?: string } },
    @Body() dto: PayEmiDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }

    const studentProfile = await this.studentService.findByUserId(userId);
    if (!studentProfile) {
      throw new HttpException('Student profile not found for this user', HttpStatus.NOT_FOUND);
    }

    return this.paymentService.createEmiPaymentOrder(studentProfile.id, dto);
  }

  @Post('verify-emi')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify EMI installment payment after Razorpay checkout success' })
  @ApiResponse({
    status: 200,
    description: 'EMI payment verified successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid payment signature or EMI already paid' })
  @ApiResponse({ status: 404, description: 'Order or EMI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: VerifyPaymentDto })
  async verifyEmiPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentService.verifyEmiPayment(dto);
  }
}
