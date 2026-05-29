import { Controller, Post, Get, Delete, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { CommentsService } from './comments.service';

class CreateCommentDto {
  @IsString() reportId: string;
  @IsString() @MaxLength(1000) text: string;
  @IsString() @IsOptional() parentId?: string;
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req: any, @Body() dto: CreateCommentDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get('report/:reportId')
  getByReport(@Param('reportId') reportId: string, @Query('page') page?: string) {
    return this.service.getByReport(reportId, Number(page) || 1);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.service.delete(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/like')
  like(@Param('id') id: string) {
    return this.service.likeComment(id);
  }
}
