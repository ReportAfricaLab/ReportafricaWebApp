import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity, QuizQuestionEntity, QuizAttemptEntity } from '../../database/entities';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepo: Repository<QuizEntity>,
    @InjectRepository(QuizQuestionEntity)
    private readonly questionRepo: Repository<QuizQuestionEntity>,
    @InjectRepository(QuizAttemptEntity)
    private readonly attemptRepo: Repository<QuizAttemptEntity>,
  ) {}

  // === PUBLIC ===

  async getQuizByLesson(lessonId: string) {
    const quiz = await this.quizRepo.findOne({ where: { lessonId }, relations: ['questions'] });
    if (!quiz) return null;
    // Sort questions and strip correct answers for student view
    const questions = (quiz.questions || [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(q => ({ id: q.id, questionText: q.questionText, options: q.options, sortOrder: q.sortOrder }));
    return { id: quiz.id, title: quiz.title, passingScore: quiz.passingScore, maxAttempts: quiz.maxAttempts, questions };
  }

  async submitQuiz(userId: string, quizId: string, answers: number[]) {
    const quiz = await this.quizRepo.findOne({ where: { id: quizId }, relations: ['questions'] });
    if (!quiz) throw new NotFoundException('Quiz not found');

    // Check max attempts
    const attemptCount = await this.attemptRepo.count({ where: { userId, quizId } });
    if (attemptCount >= quiz.maxAttempts) {
      throw new BadRequestException(`Maximum attempts (${quiz.maxAttempts}) reached for this quiz.`);
    }

    // Calculate score
    const questions = quiz.questions.sort((a, b) => a.sortOrder - b.sortOrder);
    if (answers.length !== questions.length) {
      throw new BadRequestException('Must answer all questions.');
    }

    let correct = 0;
    const results = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctOptionIndex;
      if (isCorrect) correct++;
      return { questionId: q.id, selectedOption: answers[i], correctOption: q.correctOptionIndex, isCorrect };
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = this.attemptRepo.create({ userId, quizId, score, passed, answers });
    await this.attemptRepo.save(attempt);

    return { score, passed, passingScore: quiz.passingScore, totalQuestions: questions.length, correctAnswers: correct, results, attemptsUsed: attemptCount + 1, maxAttempts: quiz.maxAttempts };
  }

  async getUserAttempts(userId: string, quizId: string) {
    return this.attemptRepo.find({ where: { userId, quizId }, order: { createdAt: 'DESC' } });
  }

  async hasPassedQuiz(userId: string, lessonId: string): Promise<boolean> {
    const quiz = await this.quizRepo.findOne({ where: { lessonId } });
    if (!quiz) return true; // No quiz = auto-pass
    const passedAttempt = await this.attemptRepo.findOne({ where: { userId, quizId: quiz.id, passed: true } });
    return !!passedAttempt;
  }

  // === ADMIN ===

  async createQuiz(dto: { lessonId: string; title?: string; passingScore?: number; maxAttempts?: number; questions: { questionText: string; options: string[]; correctOptionIndex: number }[] }) {
    const quiz = this.quizRepo.create({
      lessonId: dto.lessonId,
      title: dto.title || 'Quiz',
      passingScore: dto.passingScore || 70,
      maxAttempts: dto.maxAttempts || 3,
    });
    const savedQuiz = await this.quizRepo.save(quiz);

    // Save questions
    for (let i = 0; i < dto.questions.length; i++) {
      const q = dto.questions[i];
      await this.questionRepo.save(this.questionRepo.create({
        quizId: savedQuiz.id,
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        sortOrder: i,
      }));
    }

    return this.quizRepo.findOne({ where: { id: savedQuiz.id }, relations: ['questions'] });
  }

  async updateQuiz(id: string, dto: Partial<{ title: string; passingScore: number; maxAttempts: number }>) {
    const quiz = await this.quizRepo.findOne({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    Object.assign(quiz, dto);
    return this.quizRepo.save(quiz);
  }

  async deleteQuiz(id: string) {
    const quiz = await this.quizRepo.findOne({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    await this.quizRepo.remove(quiz);
    return { deleted: true };
  }

  async getQuizResults(quizId: string) {
    const attempts = await this.attemptRepo.find({ where: { quizId }, order: { createdAt: 'DESC' }, take: 100 });
    const total = attempts.length;
    const passed = attempts.filter(a => a.passed).length;
    const avgScore = total > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / total) : 0;
    return { quizId, totalAttempts: total, passedCount: passed, failedCount: total - passed, passRate: total > 0 ? Math.round((passed / total) * 100) : 0, avgScore, attempts };
  }
}
