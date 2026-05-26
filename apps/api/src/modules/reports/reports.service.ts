import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from '../../database/entities';
import { CreateReportDto } from './dto/create-report.dto';
import { ModerationService } from '../moderation/moderation.service';
import { TrustService } from '../trust/trust.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
    private readonly moderationService: ModerationService,
    private readonly trustService: TrustService,
  ) {}

  async create(authorId: string, country: string, dto: CreateReportDto): Promise<ReportEntity> {
    // AI moderation check
    const modResult = await this.moderationService.moderateReport(dto.title, dto.description, dto.category);

    if (!modResult.isApproved && modResult.flags.includes('hate_speech')) {
      throw new BadRequestException('Report rejected: violates community guidelines');
    }

    const report = this.reportRepo.create({
      ...dto,
      authorId,
      country,
      severity: dto.severity || 'medium',
      media: dto.media || [],
      verificationLevel: modResult.suggestedVerification || 'unverified',
    });

    const saved = await this.reportRepo.save(report);

    // Award trust points for creating a report
    await this.trustService.addScore(authorId, 'report_created');

    // If AI flagged as spam, deduct points
    if (modResult.flags.includes('spam')) {
      await this.trustService.addScore(authorId, 'report_flagged_spam');
    }

    return saved;
  }

  async findById(id: string): Promise<ReportEntity | null> {
    return this.reportRepo.findOne({ where: { id }, relations: ['author'] });
  }

  async getFeed(country: string, page = 1, limit = 20) {
    return this.reportRepo.find({
      where: { country },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });
  }

  async getNearby(latitude: number, longitude: number, radiusKm = 10, page = 1, limit = 20) {
    const radiusDegrees = radiusKm / 111;
    return this.reportRepo
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.author', 'author')
      .where('report.latitude BETWEEN :minLat AND :maxLat', {
        minLat: latitude - radiusDegrees,
        maxLat: latitude + radiusDegrees,
      })
      .andWhere('report.longitude BETWEEN :minLng AND :maxLng', {
        minLng: longitude - radiusDegrees,
        maxLng: longitude + radiusDegrees,
      })
      .orderBy('report.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async getByCategory(country: string, category: string, page = 1, limit = 20) {
    return this.reportRepo.find({
      where: { country, category },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });
  }

  async upvote(id: string) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) return null;

    await this.reportRepo.increment({ id }, 'upvotes', 1);
    await this.trustService.addScore(report.authorId, 'report_upvoted');

    return this.findById(id);
  }

  async downvote(id: string) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) return null;

    await this.reportRepo.increment({ id }, 'downvotes', 1);
    await this.trustService.addScore(report.authorId, 'report_downvoted');

    return this.findById(id);
  }
}
