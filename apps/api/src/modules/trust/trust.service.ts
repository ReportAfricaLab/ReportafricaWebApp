import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities';
import { ReportEntity } from '../../database/entities';

const TRUST_LEVELS = [
  { name: 'new_reporter', minScore: 0 },
  { name: 'community_reporter', minScore: 50 },
  { name: 'trusted_reporter', minScore: 200 },
  { name: 'elite_reporter', minScore: 500 },
  { name: 'investigative_reporter', minScore: 1000 },
];

const SCORE_RULES = {
  report_created: 5,
  report_verified: 20,
  report_upvoted: 2,
  report_downvoted: -3,
  report_trending: 15,
  report_flagged_spam: -25,
  report_flagged_fake: -50,
  consecutive_days_active: 3,
};

@Injectable()
export class TrustService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
  ) {}

  async addScore(userId: string, event: keyof typeof SCORE_RULES): Promise<{ trustScore: number; trustLevel: string }> {
    const points = SCORE_RULES[event];
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newScore = Math.max(0, user.trustScore + points);
    const newLevel = this.calculateLevel(newScore);

    await this.userRepo.update(userId, { trustScore: newScore, trustLevel: newLevel });
    return { trustScore: newScore, trustLevel: newLevel };
  }

  async getUserTrustProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const totalReports = await this.reportRepo.count({ where: { authorId: userId } });
    const totalUpvotes = await this.reportRepo
      .createQueryBuilder('report')
      .select('SUM(report.upvotes)', 'total')
      .where('report.authorId = :userId', { userId })
      .getRawOne();

    const nextLevel = TRUST_LEVELS.find((l) => l.minScore > user.trustScore);

    return {
      trustScore: user.trustScore,
      trustLevel: user.trustLevel,
      totalReports,
      totalUpvotes: Number(totalUpvotes?.total || 0),
      nextLevel: nextLevel ? { name: nextLevel.name, pointsNeeded: nextLevel.minScore - user.trustScore } : null,
      badges: this.getBadges(user.trustScore, totalReports),
    };
  }

  private calculateLevel(score: number): string {
    let level = TRUST_LEVELS[0].name;
    for (const l of TRUST_LEVELS) {
      if (score >= l.minScore) level = l.name;
    }
    return level;
  }

  private getBadges(score: number, totalReports: number): string[] {
    const badges: string[] = [];
    if (totalReports >= 1) badges.push('first_report');
    if (totalReports >= 10) badges.push('active_reporter');
    if (totalReports >= 50) badges.push('prolific_reporter');
    if (score >= 100) badges.push('trusted');
    if (score >= 500) badges.push('elite');
    return badges;
  }
}
