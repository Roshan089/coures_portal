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
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

@ApiTags('student')
@Controller('student')
@ApiBearerAuth('JWT-auth')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a student profile' })
  @ApiResponse({ status: 201, description: 'Student profile created' })
  @ApiResponse({ status: 400, description: 'User must have role student' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Student profile already exists for this user' })
  @ApiBody({ type: CreateStudentProfileDto })
  create(@Body() dto: CreateStudentProfileDto) {
    return this.studentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student profiles' })
  @ApiResponse({ status: 200, description: 'List of student profiles' })
  findAll() {
    return this.studentService.findAll();
  }

  @Get('profile/me')
  @ApiOperation({ summary: 'Get current user\'s student profile (for profile-gated flow)' })
  @ApiResponse({ status: 200, description: 'Student profile' })
  @ApiResponse({ status: 404, description: 'Student profile not found for this user' })
  async getProfileMe(@Req() req: { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }
    const profile = await this.studentService.findOptionalByUserId(userId);
    if (!profile) {
      throw new HttpException('Student profile not found for this user', HttpStatus.NOT_FOUND);
    }
    return this.studentService.sanitizeProfile(profile);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get student profile by user ID' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Student profile' })
  findByUserId(@Param('userId') userId: string) {
    return this.studentService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student profile by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Student profile UUID' })
  @ApiResponse({ status: 200, description: 'Student profile' })
  @ApiResponse({ status: 404, description: 'Student profile not found' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student profile' })
  @ApiParam({ name: 'id', type: 'string', description: 'Student profile UUID' })
  @ApiResponse({ status: 200, description: 'Student profile updated' })
  @ApiResponse({ status: 404, description: 'Student profile not found' })
  @ApiBody({ type: UpdateStudentProfileDto })
  update(@Param('id') id: string, @Body() dto: UpdateStudentProfileDto) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a student profile' })
  @ApiParam({ name: 'id', type: 'string', description: 'Student profile UUID' })
  @ApiResponse({ status: 204, description: 'Student profile deleted' })
  @ApiResponse({ status: 404, description: 'Student profile not found' })
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
