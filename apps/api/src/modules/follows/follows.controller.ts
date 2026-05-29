import { Controller, Post, Delete, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly service: FollowsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':userId')
  follow(@Request() req: any, @Param('userId') userId: string) {
    return this.service.follow(req.user.id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':userId')
  unfollow(@Request() req: any, @Param('userId') userId: string) {
    return this.service.unfollow(req.user.id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check/:userId')
  isFollowing(@Request() req: any, @Param('userId') userId: string) {
    return this.service.isFollowing(req.user.id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('feed')
  getFollowingFeed(@Request() req: any, @Query('page') page?: string) {
    return this.service.getFollowingFeed(req.user.id, Number(page) || 1);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string, @Query('page') page?: string) {
    return this.service.getFollowers(userId, Number(page) || 1);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string, @Query('page') page?: string) {
    return this.service.getFollowing(userId, Number(page) || 1);
  }

  @Get(':userId/counts')
  async getCounts(@Param('userId') userId: string) {
    const [followers, following] = await Promise.all([
      this.service.getFollowerCount(userId),
      this.service.getFollowingCount(userId),
    ]);
    return { followers, following };
  }
}
