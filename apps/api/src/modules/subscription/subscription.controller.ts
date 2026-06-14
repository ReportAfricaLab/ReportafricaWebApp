import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString } from 'class-validator';
import { SubscriptionService } from './subscription.service';

class SubscribeDto {
  @IsString() tier: string;
  @IsString() email: string;
}

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Get('plans')
  getPlans(@Query('country') country: string) {
    return this.service.getPlans(country || 'NG');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('subscribe')
  subscribe(@Request() req: any, @Body() dto: SubscribeDto) {
    return this.service.subscribe(req.user.id, dto.tier, dto.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMySubscription(@Request() req: any) {
    return this.service.getMySubscription(req.user.id);
  }
}
