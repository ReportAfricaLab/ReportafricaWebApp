import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { LessonEntity } from './lesson.entity';

@Entity('quizzes')
export class QuizEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lesson_id' })
  @Index()
  lessonId: string;

  @ManyToOne(() => LessonEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;

  @Column({ default: 'Quiz' })
  title: string;

  @Column({ name: 'passing_score', type: 'int', default: 70 })
  passingScore: number; // percentage needed to pass

  @Column({ name: 'max_attempts', type: 'int', default: 3 })
  maxAttempts: number;

  @OneToMany(() => QuizQuestionEntity, (q) => q.quiz, { cascade: true })
  questions: QuizQuestionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('quiz_questions')
export class QuizQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quiz_id' })
  @Index()
  quizId: string;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ type: 'jsonb', default: '[]' })
  options: string[]; // array of option strings

  @Column({ name: 'correct_option_index', type: 'int' })
  correctOptionIndex: number; // 0-based index

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}

@Entity('quiz_attempts')
export class QuizAttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({ name: 'quiz_id' })
  @Index()
  quizId: string;

  @ManyToOne(() => QuizEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;

  @Column({ type: 'int' })
  score: number; // percentage

  @Column({ default: false })
  passed: boolean;

  @Column({ type: 'jsonb', default: '[]' })
  answers: number[]; // user's selected option indices

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
