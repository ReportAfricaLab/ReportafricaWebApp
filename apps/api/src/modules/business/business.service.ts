import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessEntity } from '../../database/entities';
import { PaystackService } from '../donations/paystack.service';

const TIERS = {
  basic: { usd: 6.7, label: 'Basic' },
  pro: { usd: 23.3, label: 'Pro' },
  enterprise: { usd: 50, label: 'Enterprise' },
};

const COUNTRY_CURRENCY: Record<string, string> = {
  NG: 'NGN', GH: 'GHS', KE: 'KES', ZA: 'ZAR', UG: 'UGX', RW: 'RWF',
  TZ: 'TZS', ET: 'ETB', SN: 'XOF', CM: 'XAF', EG: 'EGP', MA: 'MAD',
};

const CURRENCY_RATES: Record<string, number> = {
  NGN: 1500, GHS: 14, KES: 150, ZAR: 18, UGX: 3700, RWF: 1300,
  TZS: 2600, ETB: 57, XOF: 600, XAF: 600, EGP: 48, MAD: 10, USD: 1,
};

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepo: Repository<BusinessEntity>,
    private readonly paystackService: PaystackService,
  ) {}

  async register(ownerId: string, country: string, dto: { name: string; description?: string; category: string; state?: string; city?: string; address?: string; latitude?: number; longitude?: number; phone?: string; email?: string; website?: string; logoUrl?: string }) {
    const existing = await this.businessRepo.findOne({ where: { ownerId, name: dto.name } });
    if (existing) throw new BadRequestException('Business already registered');

    const business = this.businessRepo.create({ ...dto, ownerId, country });
    return this.businessRepo.save(business);
  }

  async subscribe(businessId: string, ownerId: string, tier: string, email: string) {
    const business = await this.businessRepo.findOne({ where: { id: businessId, ownerId } });
    if (!business) throw new NotFoundException('Business not found');
    if (!TIERS[tier as keyof typeof TIERS]) throw new BadRequestException('Invalid tier');

    const currency = COUNTRY_CURRENCY[business.country] || 'USD';
    const rate = CURRENCY_RATES[currency] || 1;
    const amount = Math.round(TIERS[tier as keyof typeof TIERS].usd * rate);
    const reference = this.paystackService.generateReference();

    const payment = await this.paystackService.initializePayment({
      email,
      amount: amount * 100,
      currency,
      reference,
      metadata: { type: 'business_subscription', businessId, tier, ownerId },
    });

    return { paymentUrl: payment.data?.authorization_url, reference, tier, amount, currency };
  }

  async activateSubscription(businessId: string, tier: string) {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    await this.businessRepo.update(businessId, { subscriptionTier: tier, subscriptionExpires: expires, isVerified: true });
  }

  async getMyBusinesses(ownerId: string) {
    return this.businessRepo.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  async getVerifiedNearby(country: string, lat?: number, lng?: number, page = 1, limit = 20) {
    const qb = this.businessRepo.createQueryBuilder('b')
      .where('b.country = :country', { country })
      .andWhere('b.isVerified = true')
      .andWhere('b.isActive = true')
      .orderBy('b.subscriptionTier', 'DESC')
      .addOrderBy('b.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (lat && lng) {
      const radius = 10 / 111;
      qb.andWhere('b.latitude BETWEEN :minLat AND :maxLat', { minLat: lat - radius, maxLat: lat + radius })
        .andWhere('b.longitude BETWEEN :minLng AND :maxLng', { minLng: lng - radius, maxLng: lng + radius });
    }

    return qb.getMany();
  }

  async getById(id: string) {
    return this.businessRepo.findOne({ where: { id }, relations: ['owner'] });
  }

  getPlans(country: string) {
    const currency = COUNTRY_CURRENCY[country] || 'USD';
    const rate = CURRENCY_RATES[currency] || 1;
    return Object.entries(TIERS).map(([key, tier]) => ({
      tier: key,
      label: tier.label,
      price: Math.round(tier.usd * rate),
      currency,
    }));
  }

  async handleWebhook(reference: string, metadata: any) {
    if (metadata?.type !== 'business_subscription') return;
    await this.activateSubscription(metadata.businessId, metadata.tier);
  }
}
