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
  Req,
  Query,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { UpdateStudentAccessStatusDto } from './dto/update-student-access-status.dto';

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

  @Get('profile/me')
  @ApiOperation({ summary: 'Get current user\'s teacher profile (for profile-gated flow)' })
  @ApiResponse({ status: 200, description: 'Teacher profile' })
  @ApiResponse({ status: 404, description: 'Teacher profile not found for this user' })
  async getProfileMe(@Req() req: { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }
    const profile = await this.teacherService.findOptionalByUserId(userId);
    if (!profile) {
      throw new HttpException('Teacher profile not found for this user', HttpStatus.NOT_FOUND);
    }
    return this.teacherService.sanitizeProfile(profile);
  }

  @Get('students')
  @ApiOperation({ summary: 'Get students enrolled in the current teacher\'s courses (course-wise, with payment details)' })
  @ApiQuery({ name: 'courseId', required: false, description: 'Filter by course UUID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by access status (e.g. active, suspended)' })
  @ApiResponse({ status: 200, description: 'List of enrollments with student, course, and payment/EMI details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Teacher profile not found' })
  async getTeacherStudents(
    @Req() req: { user?: { sub?: string } },
    @Query('courseId') courseId?: string,
    @Query('status') status?: string,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }
    const profile = await this.teacherService.findOptionalByUserId(userId);
    if (!profile) {
      throw new HttpException('Teacher profile not found for this user', HttpStatus.NOT_FOUND);
    }
    return this.teacherService.getTeacherStudents(profile.id, { courseId, status });
  }

  @Patch('students/:courseAccessId')
  @ApiOperation({ summary: 'Update a student\'s course access status (e.g. suspend/activate for rule violation)' })
  @ApiParam({ name: 'courseAccessId', type: 'string', description: 'Course access record UUID' })
  @ApiResponse({ status: 200, description: 'Access status updated' })
  @ApiResponse({ status: 403, description: 'Not your course enrollment' })
  @ApiResponse({ status: 404, description: 'Course access not found' })
  @ApiBody({ type: UpdateStudentAccessStatusDto })
  async updateStudentAccessStatus(
    @Req() req: { user?: { sub?: string } },
    @Param('courseAccessId') courseAccessId: string,
    @Body() dto: UpdateStudentAccessStatusDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }
    const profile = await this.teacherService.findOptionalByUserId(userId);
    if (!profile) {
      throw new HttpException('Teacher profile not found for this user', HttpStatus.NOT_FOUND);
    }
    return this.teacherService.updateStudentAccessStatus(profile.id, courseAccessId, dto);
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
