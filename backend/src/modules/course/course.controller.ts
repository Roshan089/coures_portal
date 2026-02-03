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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('course')
@Controller('course')
@ApiBearerAuth('JWT-auth')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

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
