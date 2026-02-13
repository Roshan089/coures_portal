import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Our order ID (from create-order response)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Razorpay payment ID (from checkout success)',
    example: 'pay_xxxxx',
  })
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty({
    description: 'Razorpay signature (from checkout success)',
    example: 'signature_xxxxx',
  })
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;

  @ApiProperty({
    description: 'EMI ID (optional, for EMI installment payments)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  emiId?: string;

  @ApiProperty({
    description: 'Razorpay order ID used for this payment (required for 2nd+ EMI; from pay-emi response)',
    example: 'order_xxxxx',
    required: false,
  })
  @IsString()
  @IsOptional()
  razorpayOrderId?: string;
}
