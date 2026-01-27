import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherProfileDto {
  @ApiProperty({
    description: 'User ID (from users table) - must have role teacher',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Teacher display name',
    example: 'Jane Teacher',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Teacher bio',
    example: 'Mathematics teacher',
    type: String,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
    type: String,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/avatar.jpg',
    type: String,
  })
  @IsUrl()
  @IsOptional()
  profilePicUrl?: string;

  @ApiPropertyOptional({
    description: 'Age in years',
    example: 35,
    minimum: 1,
    maximum: 150,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Max(150)
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({
    description: 'Whether the teacher profile is approved',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
