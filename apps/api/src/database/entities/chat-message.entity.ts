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

@Entity('chat_messages')
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'room_id' })
  @Index()
  roomId: string; // "stream:{id}" or "report:{id}"

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  username: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ default: 'message' })
  type: string; // message, system, alert

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
