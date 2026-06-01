import { Controller, Post, Get, Patch, Param, Body, Query, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { MediaLicensingService } from './media-licensing.service';

class RequestLicenseDto {
  @IsString() reportId: string;
  @IsString() organizationName: string;
  @IsString() @IsIn(['tv_station', 'newspaper', 'blog', 'news_agency']) organizationType: string;
  @IsString() purpose: string;
  @IsNumber() @IsOptional() offeredAmount?: number;
  @IsString() @IsOptional() currency?: string;
  @IsString() @IsIn(['one_time', 'exclusive', 'non_exclusive']) @IsOptional() licenseType?: string;
}

class RespondDto {
  @IsString() @IsIn(['approved', 'rejected']) action: 'approved' | 'rejected';
}

class PayLicenseDto {
  @IsString() email: string;
  @IsString() name: string;
}

@Controller('media-licensing')
export class MediaLicensingController {
  constructor(private readonly service: MediaLicensingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('request')
  requestLicense(@Request() req: any, @Body() dto: RequestLicenseDto) {
    return this.service.requestLicense(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-requests')
  getMyRequests(@Request() req: any, @Query('page') page?: string) {
    return this.service.getMyRequests(req.user.id, Number(page) || 1);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('incoming')
  getIncomingRequests(@Request() req: any, @Query('page') page?: string) {
    return this.service.getIncomingRequests(req.user.id, Number(page) || 1);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/respond')
  respond(@Param('id') id: string, @Request() req: any, @Body() dto: RespondDto) {
    return this.service.respondToRequest(id, req.user.id, dto.action);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/pay')
  payForLicense(@Param('id') id: string, @Body() dto: PayLicenseDto) {
    return this.service.initiatePayment(id, dto.email, dto.name);
  }

  @Post('webhook/korapay')
  handleWebhook(@Body() body: any, @Headers('x-korapay-signature') signature: string) {
    // Verify KoraPay webhook signature
    const crypto = require('crypto');
    const secret = process.env.KORAPAY_SECRET_KEY || '';
    const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
    if (hash !== signature) return { status: 'invalid signature' };

    if (body.event === 'charge.success') {
      this.service.handlePaymentWebhook(body.data?.reference, body.event);
    }
    return { status: 'ok' };
  }
}
