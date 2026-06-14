import { Controller, Post, Get, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { BusinessService } from './business.service';

class RegisterBusinessDto {
  @IsString() name: string;
  @IsString() @IsOptional() description?: string;
  @IsString() category: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() address?: string;
  @IsNumber() @IsOptional() latitude?: number;
  @IsNumber() @IsOptional() longitude?: number;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() email?: string;
  @IsString() @IsOptional() website?: string;
  @IsString() @IsOptional() logoUrl?: string;
}

class SubscribeDto {
  @IsString() businessId: string;
  @IsString() tier: string;
  @IsString() email: string;
}

@Controller('businesses')
export class BusinessController {
  constructor(private readonly service: BusinessService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  register(@Request() req: any, @Body() dto: RegisterBusinessDto) {
    return this.service.register(req.user.id, req.user.country, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('subscribe')
  subscribe(@Request() req: any, @Body() dto: SubscribeDto) {
    return this.service.subscribe(dto.businessId, req.user.id, dto.tier, dto.email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMyBusinesses(@Request() req: any) {
    return this.service.getMyBusinesses(req.user.id);
  }

  @Get('plans')
  getPlans(@Query('country') country: string) {
    return this.service.getPlans(country || 'NG');
  }

  @Get('verified')
  getVerified(@Query('country') country: string, @Query('lat') lat?: string, @Query('lng') lng?: string, @Query('page') page?: string) {
    return this.service.getVerifiedNearby(country || 'NG', lat ? Number(lat) : undefined, lng ? Number(lng) : undefined, Number(page) || 1);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
