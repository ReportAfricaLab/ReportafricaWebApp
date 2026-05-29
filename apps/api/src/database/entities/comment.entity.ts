import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ReportEntity } from './report.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'report_id' })
  @Index()
  reportId: string;

  @ManyToOne(() => ReportEntity)
  @JoinColumn({ name: 'report_id' })
  report: ReportEntity;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'text' })
  text: string;

  @Column({ name: 'parent_id', nullable: true })
  @Index()
  parentId: string | null;

  @ManyToOne(() => CommentEntity, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: CommentEntity | null;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
