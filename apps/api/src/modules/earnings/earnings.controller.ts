import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EarningsService } from './earnings.service';

@Controller('earnings')
export class EarningsController {
  constructor(private readonly service: EarningsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getMyEarnings(@Request() req: any, @Query('page') page?: string) {
    return this.service.getReporterEarnings(req.user.id, Number(page) || 1);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stats')
  getMyStats(@Request() req: any) {
    return this.service.getReporterStats(req.user.id);
  }
}
