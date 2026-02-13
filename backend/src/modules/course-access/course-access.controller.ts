import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CourseAccessService } from './course-access.service';
import { StudentService } from '../student/student.service';

@ApiTags('course-access')
@Controller('course-access')
@ApiBearerAuth('JWT-auth')
export class CourseAccessController {
  constructor(
    private readonly courseAccessService: CourseAccessService,
    private readonly studentService: StudentService,
  ) {}

  @Get('my-courses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all courses that the logged-in student has access to' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of courses the student has purchased/access to',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - student profile not found' })
  async getMyCourses(@Req() req: { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }

    const studentProfile = await this.studentService.findOptionalByUserId(userId);
    if (!studentProfile) {
      throw new HttpException('Student profile not found for this user', HttpStatus.NOT_FOUND);
    }

    return this.courseAccessService.getStudentCourses(studentProfile.id);
  }
}
