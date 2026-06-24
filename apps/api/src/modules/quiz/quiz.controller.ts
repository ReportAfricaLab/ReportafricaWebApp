import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { IsString, IsNumber, IsArray, IsOptional, IsInt, Min, Max } from 'class-validator';
import { QuizService } from './quiz.service';

class SubmitQuizDto {
  @IsArray() answers: number[];
}

class CreateQuizDto {
  @IsString() lessonId: string;
  @IsString() @IsOptional() title?: string;
  @IsInt() @IsOptional() @Min(1) @Max(100) passingScore?: number;
  @IsInt() @IsOptional() @Min(1) maxAttempts?: number;
  @IsArray() questions: { questionText: string; options: string[]; correctOptionIndex: number }[];
}

@Controller('quizzes')
export class QuizController {
  constructor(private readonly service: QuizService) {}

  @Get('lesson/:lessonId')
  getQuizByLesson(@Param('lessonId') lessonId: string) {
    return this.service.getQuizByLesson(lessonId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':quizId/submit')
  submitQuiz(@Request() req: any, @Param('quizId') quizId: string, @Body() dto: SubmitQuizDto) {
    return this.service.submitQuiz(req.user.id, quizId, dto.answers);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':quizId/attempts')
  getMyAttempts(@Request() req: any, @Param('quizId') quizId: string) {
    return this.service.getUserAttempts(req.user.id, quizId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('lesson/:lessonId/passed')
  hasPassedQuiz(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.service.hasPassedQuiz(req.user.id, lessonId);
  }
}

@Controller('admin/quizzes')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminQuizController {
  constructor(private readonly service: QuizService) {}

  @Post()
  createQuiz(@Body() dto: CreateQuizDto) {
    return this.service.createQuiz(dto);
  }

  @Patch(':id')
  updateQuiz(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateQuiz(id, dto);
  }

  @Delete(':id')
  deleteQuiz(@Param('id') id: string) {
    return this.service.deleteQuiz(id);
  }

  @Get(':id/results')
  getResults(@Param('id') id: string) {
    return this.service.getQuizResults(id);
  }
}
