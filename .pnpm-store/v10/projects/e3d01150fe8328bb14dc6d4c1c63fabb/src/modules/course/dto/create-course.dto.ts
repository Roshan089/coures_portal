import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Mathematics',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Course description',
    example: 'A foundational course covering algebra and calculus.',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Teacher profile ID (owner of the course)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  teacherId: string;

  @ApiPropertyOptional({
    description: 'Whether the course is published and visible to students',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Course price in INR (paise not supported; use rupees)',
    example: '999.00',
    default: '0',
  })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({
    description: 'Whether EMI is allowed for this course',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  emiAllowed?: boolean;

  @ApiPropertyOptional({
    description: 'Number of EMI installments when emi_allowed is true',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  emiCount?: number;
}
