import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';

@ApiTags('teacher')
@Controller('teacher')
@ApiBearerAuth('JWT-auth')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a teacher profile' })
  @ApiResponse({ status: 201, description: 'Teacher profile created' })
  @ApiResponse({ status: 400, description: 'User must have role teacher' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Teacher profile already exists for this user' })
  @ApiBody({ type: CreateTeacherProfileDto })
  create(@Body() dto: CreateTeacherProfileDto) {
    return this.teacherService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teacher profiles' })
  @ApiResponse({ status: 200, description: 'List of teacher profiles' })
  findAll() {
    return this.teacherService.findAll();
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get teacher profile by user ID' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Teacher profile' })
  findByUserId(@Param('userId') userId: string) {
    return this.teacherService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher profile by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Teacher profile UUID' })
  @ApiResponse({ status: 200, description: 'Teacher profile' })
  @ApiResponse({ status: 404, description: 'Teacher profile not found' })
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher profile' })
  @ApiParam({ name: 'id', type: 'string', description: 'Teacher profile UUID' })
  @ApiResponse({ status: 200, description: 'Teacher profile updated' })
  @ApiResponse({ status: 404, description: 'Teacher profile not found' })
  @ApiBody({ type: UpdateTeacherProfileDto })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherProfileDto) {
    return this.teacherService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a teacher profile' })
  @ApiParam({ name: 'id', type: 'string', description: 'Teacher profile UUID' })
  @ApiResponse({ status: 204, description: 'Teacher profile deleted' })
  @ApiResponse({ status: 404, description: 'Teacher profile not found' })
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }
}
