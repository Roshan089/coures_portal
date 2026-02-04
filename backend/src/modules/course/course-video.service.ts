import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseVideo } from './entities/course-video.entity';
import { CreateCourseVideoDto } from './dto/create-course-video.dto';
import { UpdateCourseVideoDto } from './dto/update-course-video.dto';
import { CourseService } from './course.service';

@Injectable()
export class CourseVideoService {
  constructor(
    @InjectRepository(CourseVideo)
    private readonly courseVideoRepository: Repository<CourseVideo>,
    private readonly courseService: CourseService,
  ) {}

  async create(courseId: string, dto: CreateCourseVideoDto) {
    await this.courseService.findOne(courseId);

    const maxOrder = await this.courseVideoRepository
      .createQueryBuilder('v')
      .select('MAX(v.sortOrder)', 'max')
      .where('v.courseId = :courseId', { courseId })
      .getRawOne<{ max: number | null }>();

    const sortOrder = dto.sortOrder ?? (maxOrder?.max != null ? maxOrder.max + 1 : 0);

    const video = this.courseVideoRepository.create({
      courseId,
      title: dto.title,
      description: dto.description ?? null,
      url: dto.url,
      sortOrder,
    });
    return this.courseVideoRepository.save(video);
  }

  async findAllByCourseId(courseId: string) {
    await this.courseService.findOne(courseId);
    return this.courseVideoRepository.find({
      where: { courseId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const video = await this.courseVideoRepository.findOne({ where: { id } });
    if (!video) {
      throw new HttpException('Course video not found', HttpStatus.NOT_FOUND);
    }
    return video;
  }

  async update(id: string, dto: UpdateCourseVideoDto) {
    const video = await this.findOne(id);

    Object.assign(video, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.url !== undefined && { url: dto.url }),
      ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
    });
    return this.courseVideoRepository.save(video);
  }

  async remove(id: string) {
    const video = await this.findOne(id);
    await this.courseVideoRepository.remove(video);
  }
}
