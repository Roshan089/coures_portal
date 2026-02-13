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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CourseVideoService } from './course-video.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseVideoDto } from './dto/create-course-video.dto';
import { UpdateCourseVideoDto } from './dto/update-course-video.dto';
import { RequireCourseAccessGuard } from '../course-access/guards/require-course-access.guard';

@ApiTags('course')
@Controller('course')
@ApiBearerAuth('JWT-auth')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseVideoService: CourseVideoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a course' })
  @ApiResponse({ status: 201, description: 'Course created' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiBody({ type: CreateCourseDto })
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'List of courses' })
  findAll() {
    return this.courseService.findAll();
  }

  @Get('by-teacher/:teacherId')
  @ApiOperation({ summary: 'Get courses by teacher profile ID' })
  @ApiParam({ name: 'teacherId', type: 'string', description: 'Teacher profile UUID' })
  @ApiResponse({ status: 200, description: 'List of courses' })
  findByTeacherId(@Param('teacherId') teacherId: string) {
    return this.courseService.findByTeacherId(teacherId);
  }

  /* ----- Course videos (more specific routes first) ----- */
  @Get('videos/:id')
  @UseGuards(RequireCourseAccessGuard)
  @ApiOperation({ summary: 'Get a course video by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Course video UUID' })
  @ApiResponse({ status: 200, description: 'Course video' })
  @ApiResponse({ status: 403, description: 'Access denied - course access required' })
  @ApiResponse({ status: 404, description: 'Course video not found' })
  findOneVideo(@Param('id') id: string) {
    return this.courseVideoService.findOne(id);
  }

  @Get(':courseId/videos')
  @UseGuards(RequireCourseAccessGuard)
  @ApiOperation({ summary: 'List videos for a course' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 200, description: 'List of course videos (ordered by sortOrder)' })
  @ApiResponse({ status: 403, description: 'Access denied - course access required' })
  findVideosByCourseId(@Param('courseId') courseId: string) {
    return this.courseVideoService.findAllByCourseId(courseId);
  }

  @Post(':courseId/videos')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a video to a course' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 201, description: 'Course video created' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiBody({ type: CreateCourseVideoDto })
  createVideo(@Param('courseId') courseId: string, @Body() dto: CreateCourseVideoDto) {
    return this.courseVideoService.create(courseId, dto);
  }

  @Patch('videos/:id')
  @ApiOperation({ summary: 'Update a course video' })
  @ApiParam({ name: 'id', type: 'string', description: 'Course video UUID' })
  @ApiResponse({ status: 200, description: 'Course video updated' })
  @ApiResponse({ status: 404, description: 'Course video not found' })
  @ApiBody({ type: UpdateCourseVideoDto })
  updateVideo(@Param('id') id: string, @Body() dto: UpdateCourseVideoDto) {
    return this.courseVideoService.update(id, dto);
  }

  @Delete('videos/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course video' })
  @ApiParam({ name: 'id', type: 'string', description: 'Course video UUID' })
  @ApiResponse({ status: 204, description: 'Course video deleted' })
  @ApiResponse({ status: 404, description: 'Course video not found' })
  removeVideo(@Param('id') id: string) {
    return this.courseVideoService.remove(id);
  }

  /* ----- Course CRUD ----- */
  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 200, description: 'Course' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 200, description: 'Course updated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiBody({ type: UpdateCourseDto })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 204, description: 'Course deleted' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
