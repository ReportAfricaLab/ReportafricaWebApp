import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TrustService } from './trust.service';

@Controller('trust')
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getTrustProfile(@Request() req: any) {
    return this.trustService.getUserTrustProfile(req.user.id);
  }
}
