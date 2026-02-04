import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseVideoDto {
  @ApiProperty({
    description: 'Video/link title',
    example: 'Introduction to the course',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Video/link description',
    example: 'Watch this first to get an overview.',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Video or link URL',
    example: 'https://www.youtube.com/watch?v=example',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(1000)
  url: string;

  @ApiPropertyOptional({
    description: 'Order within the course (lower = first)',
    example: 0,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
