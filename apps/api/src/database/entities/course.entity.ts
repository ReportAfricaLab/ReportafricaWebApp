import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LessonEntity } from './lesson.entity';

@Entity('courses')
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: '📚' })
  icon: string;

  @Column({ name: 'usd_price', type: 'decimal', precision: 10, scale: 2 })
  usdPrice: number;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => LessonEntity, (lesson) => lesson.course, { cascade: true })
  lessons: LessonEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
