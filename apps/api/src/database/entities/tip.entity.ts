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

@Entity('tips')
export class TipEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'report_id' })
  @Index()
  reportId: string;

  @ManyToOne(() => ReportEntity)
  @JoinColumn({ name: 'report_id' })
  report: ReportEntity;

  @Column({ name: 'tipper_id', nullable: true })
  tipperId: string | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'tipper_id' })
  tipper: UserEntity | null;

  @Column({ name: 'reporter_id' })
  @Index()
  reporterId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reporter_id' })
  reporter: UserEntity;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ nullable: true })
  message: string;

  @Column({ default: 'pending' })
  @Index()
  status: string; // pending, success, failed

  @Column({ name: 'payment_reference', nullable: true, unique: true })
  paymentReference: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
