import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateStudentAccessStatusDto {
  @ApiProperty({
    description: 'New access status for the student in this course',
    enum: ['active', 'suspended', 'revoked'],
  })
  @IsIn(['active', 'suspended', 'revoked'])
  status: 'active' | 'suspended' | 'revoked';
}
