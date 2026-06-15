import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity('lessons')
export class LessonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id' })
  @Index()
  courseId: string;

  @ManyToOne(() => CourseEntity, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @Column()
  title: string;

  @Column({ name: 'video_url', default: '' })
  videoUrl: string;

  @Column({ default: '' })
  duration: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
