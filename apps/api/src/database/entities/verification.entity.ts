import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ReportEntity } from './report.entity';

@Entity('verifications')
@Unique(['reportId', 'userId'])
export class VerificationEntity {
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

  @Column({ type: 'varchar' })
  vote: 'confirm' | 'dispute';

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
