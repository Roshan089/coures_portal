import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TeacherProfile } from '../../teacher/entities/teacher-profile.entity';
import { CourseVideo } from './course-video.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'uuid', name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => TeacherProfile)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherProfile;

  @Column({ type: 'boolean', default: false, name: 'is_published' })
  isPublished: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: string;

  @Column({ type: 'boolean', default: false, name: 'emi_allowed' })
  emiAllowed: boolean;

  @Column({ type: 'int', nullable: true, name: 'emi_count' })
  emiCount: number | null;

  @OneToMany(() => CourseVideo, (video) => video.course)
  videos: CourseVideo[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
