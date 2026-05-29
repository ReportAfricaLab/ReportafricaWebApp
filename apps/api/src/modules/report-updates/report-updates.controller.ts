import { Controller, Post, Get, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';
import { ReportUpdatesService } from './report-updates.service';

class CreateUpdateDto {
  @IsString() reportId: string;
  @IsString() text: string;
  @IsArray() @IsOptional() media?: { type: string; url: string }[];
  @IsString() @IsIn(['update', 'resolution', 'escalation']) @IsOptional() type?: string;
}

@Controller('report-updates')
export class ReportUpdatesController {
  constructor(private readonly service: ReportUpdatesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req: any, @Body() dto: CreateUpdateDto) {
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
}
