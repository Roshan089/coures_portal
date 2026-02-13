import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentProfileDto {
  @ApiProperty({
    description: 'User ID (from users table) - must have role student',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Student display name',
    example: 'John Student',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Student bio',
    example: 'Learning web development',
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
    example: 20,
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
    description: 'Whether the student profile is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
