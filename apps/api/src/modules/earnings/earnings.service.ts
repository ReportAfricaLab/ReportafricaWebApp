import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EarningsEntity } from '../../database/entities';

@Injectable()
export class EarningsService {
  constructor(
    @InjectRepository(EarningsEntity)
    private readonly earningsRepo: Repository<EarningsEntity>,
  ) {}

  async recordEarning(data: {
    reporterId: string;
    amount: number;
    currency: string;
    source: string;
    sourceId?: string;
    description?: string;
    paymentReference?: string;
    payerName?: string;
  }) {
    const earning = this.earningsRepo.create(data);
    return this.earningsRepo.save(earning);
  }

  async getReporterEarnings(reporterId: string, page = 1, limit = 20) {
    return this.earningsRepo.find({
      where: { reporterId, status: 'completed' },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getReporterStats(reporterId: string) {
    const totalEarned = await this.earningsRepo
      .createQueryBuilder('e')
      .select('e.currency', 'currency')
      .addSelect('SUM(e.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('e.reporterId = :reporterId', { reporterId })
      .andWhere('e.status = :status', { status: 'completed' })
      .groupBy('e.currency')
      .getRawMany();

    return {
      earnings: totalEarned.map((e) => ({ currency: e.currency, total: Number(e.total), transactions: Number(e.count) })),
    };
  }
}
