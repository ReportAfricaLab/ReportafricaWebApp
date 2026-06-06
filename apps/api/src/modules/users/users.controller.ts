import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { TipsService } from '../tips/tips.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tipsService: TipsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    // Whitelist allowed fields — block sensitive fields
    const allowedFields = ['displayName', 'avatar', 'city', 'state', 'latitude', 'longitude', 'phone', 'bankCode', 'bankName', 'bankAccountNumber', 'bankAccountName', 'fcmToken', 'isAnonymousDefault'];
    const safeData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) safeData[field] = body[field];
    }

    const updated = await this.usersService.updateProfile(req.user.id, safeData);

    // If bank details were just added, auto-pay pending tips
    if (safeData.bankAccountNumber && safeData.bankCode) {
      this.tipsService.payPendingTips(req.user.id).catch(() => {});
    }

    return updated;
  }
}
