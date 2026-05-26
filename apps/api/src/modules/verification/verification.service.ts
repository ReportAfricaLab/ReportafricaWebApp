import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationEntity } from '../../database/entities';
import { ReportEntity } from '../../database/entities';

const COMMUNITY_VERIFY_THRESHOLD = 5; // 5 confirms = community verified

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationEntity)
    private readonly verificationRepo: Repository<VerificationEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
  ) {}

  async vote(reportId: string, userId: string, vote: 'confirm' | 'dispute', comment?: string) {
    const existing = await this.verificationRepo.findOne({ where: { reportId, userId } });
    if (existing) throw new ConflictException('You have already voted on this report');

    const verification = this.verificationRepo.create({ reportId, userId, vote, comment });
    await this.verificationRepo.save(verification);

    // Check if report should be promoted to community_verified
    await this.checkAndUpdateVerificationLevel(reportId);

    return this.getReportVerificationStats(reportId);
  }

  async getReportVerificationStats(reportId: string) {
    const confirms = await this.verificationRepo.count({ where: { reportId, vote: 'confirm' } });
    const disputes = await this.verificationRepo.count({ where: { reportId, vote: 'dispute' } });
    const report = await this.reportRepo.findOne({ where: { id: reportId } });

    return {
      reportId,
      confirms,
      disputes,
      verificationLevel: report?.verificationLevel || 'unverified',
      credibilityScore: confirms > 0 ? Math.round((confirms / (confirms + disputes)) * 100) : 0,
    };
  }

  private async checkAndUpdateVerificationLevel(reportId: string) {
    const confirms = await this.verificationRepo.count({ where: { reportId, vote: 'confirm' } });
    const disputes = await this.verificationRepo.count({ where: { reportId, vote: 'dispute' } });

    let newLevel = 'unverified';
    if (confirms >= COMMUNITY_VERIFY_THRESHOLD && confirms > disputes * 2) {
      newLevel = 'community_verified';
    }

    await this.reportRepo.update(reportId, { verificationLevel: newLevel });
  }
}
