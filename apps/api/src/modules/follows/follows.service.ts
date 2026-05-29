import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FollowEntity, UserEntity, ReportEntity } from '../../database/entities';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
    private readonly notifications: NotificationsService,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new BadRequestException('Cannot follow yourself');

    const target = await this.userRepo.findOne({ where: { id: followingId } });
    if (!target) throw new NotFoundException('User not found');

    const existing = await this.followRepo.findOne({ where: { followerId, followingId } });
    if (existing) throw new ConflictException('Already following this user');

    const follow = this.followRepo.create({ followerId, followingId });
    await this.followRepo.save(follow);

    // Notify the followed user
    await this.notifications.sendToUser(followingId, {
      title: 'New follower!',
      body: 'Someone started following your reports',
      data: { type: 'follow', userId: followerId },
    });

    return { following: true };
  }

  async unfollow(followerId: string, followingId: string) {
    const follow = await this.followRepo.findOne({ where: { followerId, followingId } });
    if (!follow) throw new NotFoundException('Not following this user');
    await this.followRepo.remove(follow);
    return { following: false };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const count = await this.followRepo.count({ where: { followerId, followingId } });
    return count > 0;
  }

  async getFollowers(userId: string, page = 1, limit = 30) {
    const [data, total] = await this.followRepo.findAndCount({
      where: { followingId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['follower'],
    });
    return { data: data.map((f) => f.follower), meta: { page, limit, total } };
  }

  async getFollowing(userId: string, page = 1, limit = 30) {
    const [data, total] = await this.followRepo.findAndCount({
      where: { followerId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['following'],
    });
    return { data: data.map((f) => f.following), meta: { page, limit, total } };
  }

  async getFollowerCount(userId: string): Promise<number> {
    return this.followRepo.count({ where: { followingId: userId } });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.followRepo.count({ where: { followerId: userId } });
  }

  async getFollowingFeed(userId: string, page = 1, limit = 20) {
    // Get IDs of users this person follows
    const follows = await this.followRepo.find({
      where: { followerId: userId },
      select: ['followingId'],
    });
    const followingIds = follows.map((f) => f.followingId);
    if (followingIds.length === 0) return { data: [], meta: { page, limit, total: 0 } };

    const [data, total] = await this.reportRepo.findAndCount({
      where: { authorId: In(followingIds) },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // Called when a reporter creates a new report — notify followers
  async notifyFollowers(reporterId: string, reportTitle: string, reportId: string) {
    const followers = await this.followRepo.find({
      where: { followingId: reporterId },
      select: ['followerId'],
    });

    for (const f of followers) {
      await this.notifications.sendToUser(f.followerId, {
        title: '📰 New report from someone you follow',
        body: reportTitle.substring(0, 100),
        data: { type: 'new_report', reportId },
      });
    }
  }
}
