import { Controller, Post, Get, Param, Body, Query, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsNumber, IsOptional, IsEmail, Min } from 'class-validator';
import { TipsService } from './tips.service';

class InitiateTipDto {
  @IsString() reportId: string;
  @IsNumber() @Min(100) amount: number;
  @IsEmail() email: string;
  @IsString() @IsOptional() message?: string;
}

@Controller('tips')
export class TipsController {
  constructor(private readonly service: TipsService) {}

  @Post()
  initiateTip(@Request() req: any, @Body() dto: InitiateTipDto) {
    const tipperId = req.user?.id || null;
    return this.service.initiateTip({ ...dto, tipperId });
  }

  @Get('verify/:reference')
  verifyTip(@Param('reference') reference: string) {
    return this.service.verifyTip(reference);
  }

  @Get('report/:reportId')
  getReportTips(@Param('reportId') reportId: string) {
    return this.service.getReportTips(reportId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('received')
  getMyTips(@Request() req: any, @Query('page') page?: string) {
    return this.service.getReporterTipsReceived(req.user.id, Number(page) || 1);
  }

  @Post('webhook/paystack')
  handleWebhook(@Body() body: any) {
    if (body.event === 'charge.success') {
      this.service.handleWebhook(body.event, body.data);
    }
    return { status: 'ok' };
  }
}
