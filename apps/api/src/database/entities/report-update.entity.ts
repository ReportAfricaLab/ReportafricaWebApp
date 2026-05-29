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

@Entity('report_updates')
export class ReportUpdateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'report_id' })
  @Index()
  reportId: string;

  @ManyToOne(() => ReportEntity)
  @JoinColumn({ name: 'report_id' })
  report: ReportEntity;

  @Column({ name: 'author_id' })
  @Index()
  authorId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'jsonb', default: '[]' })
  media: { type: string; url: string }[];

  @Column({ default: 'update' })
  type: string; // update, resolution, escalation

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
