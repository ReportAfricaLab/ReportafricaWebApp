import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportUpdateEntity, ReportEntity } from '../../database/entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { FollowsService } from '../follows/follows.service';

@Injectable()
export class ReportUpdatesService {
  constructor(
    @InjectRepository(ReportUpdateEntity)
    private readonly updateRepo: Repository<ReportUpdateEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
    private readonly realtime: RealtimeGateway,
    private readonly followsService: FollowsService,
  ) {}

  async create(authorId: string, dto: { reportId: string; text: string; media?: { type: string; url: string }[]; type?: string }) {
    const report = await this.reportRepo.findOne({ where: { id: dto.reportId } });
    if (!report) throw new NotFoundException('Report not found');
    if (report.authorId !== authorId) throw new ForbiddenException('Only the report author can post updates');

    const update = this.updateRepo.create({
      reportId: dto.reportId,
      authorId,
      text: dto.text.trim(),
      media: dto.media || [],
      type: dto.type || 'update',
    });
    const saved = await this.updateRepo.save(update);

    // Broadcast real-time
    this.realtime.emitReportUpdate(dto.reportId, {
      type: 'report:update',
      update: { id: saved.id, text: saved.text, type: saved.type, createdAt: saved.createdAt },
    });

    // Notify followers of the reporter
    this.followsService.notifyFollowers(authorId, `Update: ${dto.text.substring(0, 60)}`, dto.reportId).catch(() => {});

    return saved;
  }

  async getByReport(reportId: string, page = 1, limit = 20) {
    const [data, total] = await this.updateRepo.findAndCount({
      where: { reportId },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async delete(updateId: string, authorId: string) {
    const update = await this.updateRepo.findOne({ where: { id: updateId } });
    if (!update) throw new NotFoundException('Update not found');
    if (update.authorId !== authorId) throw new ForbiddenException('Not your update');
    await this.updateRepo.remove(update);
    return { deleted: true };
  }
}
