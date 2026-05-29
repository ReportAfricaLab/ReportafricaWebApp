import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipEntity, ReportEntity } from '../../database/entities';
import { PaystackService } from '../donations/paystack.service';
import { EarningsService } from '../earnings/earnings.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(TipEntity)
    private readonly tipRepo: Repository<TipEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
    private readonly paystackService: PaystackService,
    private readonly earningsService: EarningsService,
    private readonly notifications: NotificationsService,
  ) {}

  async initiateTip(dto: { reportId: string; amount: number; email: string; message?: string; tipperId?: string }) {
    const report = await this.reportRepo.findOne({ where: { id: dto.reportId } });
    if (!report) throw new NotFoundException('Report not found');
    if (dto.amount < 100) throw new BadRequestException('Minimum tip is 100');

    const reference = this.paystackService.generateReference();
    const currency = 'NGN'; // Derive from report country in production

    const tip = this.tipRepo.create({
      reportId: dto.reportId,
      reporterId: report.authorId,
      tipperId: dto.tipperId || null,
      amount: dto.amount,
      currency,
      message: dto.message,
      status: 'pending',
      paymentReference: reference,
    });
    await this.tipRepo.save(tip);

    const payment = await this.paystackService.initializePayment({
      email: dto.email,
      amount: dto.amount * 100, // kobo
      currency,
      reference,
      metadata: { tipId: tip.id, reportId: dto.reportId, reporterId: report.authorId },
    });

    return { tip, paymentUrl: payment.data?.authorization_url, reference };
  }

  async verifyTip(reference: string) {
    const tip = await this.tipRepo.findOne({ where: { paymentReference: reference } });
    if (!tip) throw new NotFoundException('Tip not found');

    const verification = await this.paystackService.verifyPayment(reference);

    if (verification.data?.status === 'success') {
      tip.status = 'success';
      await this.tipRepo.save(tip);

      // Record in earnings (platform takes 10%, reporter gets 90%)
      const reporterAmount = tip.amount * 0.9;
      await this.earningsService.recordEarning({
        reporterId: tip.reporterId,
        amount: reporterAmount,
        currency: tip.currency,
        source: 'tip',
        sourceId: tip.reportId,
        description: tip.message ? `Tip: "${tip.message}"` : 'Tip received',
        paymentReference: reference,
      });

      // Notify reporter
      await this.notifications.sendToUser(tip.reporterId, {
        title: '💰 You received a tip!',
        body: `Someone tipped ₦${tip.amount} on your report${tip.message ? `: "${tip.message}"` : ''}`,
        data: { type: 'tip', reportId: tip.reportId },
      });

      return { status: 'success', tip };
    }

    tip.status = 'failed';
    await this.tipRepo.save(tip);
    return { status: 'failed', tip };
  }

  async handleWebhook(event: string, data: any) {
    if (event === 'charge.success' && data.reference?.startsWith('RA_')) {
      const tip = await this.tipRepo.findOne({ where: { paymentReference: data.reference } });
      if (tip && tip.status === 'pending') {
        await this.verifyTip(data.reference);
      }
    }
  }

  async getReportTips(reportId: string) {
    const tips = await this.tipRepo.find({
      where: { reportId, status: 'success' },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    const total = tips.reduce((sum, t) => sum + Number(t.amount), 0);
    return { tips, total, count: tips.length };
  }

  async getReporterTipsReceived(reporterId: string, page = 1, limit = 20) {
    return this.tipRepo.find({
      where: { reporterId, status: 'success' },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['report'],
    });
  }
}
