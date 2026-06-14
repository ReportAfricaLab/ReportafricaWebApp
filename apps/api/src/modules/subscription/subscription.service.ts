import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities';
import { PaystackService } from '../donations/paystack.service';

const TIERS = {
  pro: { usd: 3.3, label: 'Reporter Pro' },
  elite: { usd: 13.3, label: 'Reporter Elite' },
  legend: { usd: 33.3, label: 'Reporter Legend' },
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
export class SubscriptionService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly paystackService: PaystackService,
  ) {}

  getPlans(country: string) {
    const currency = COUNTRY_CURRENCY[country] || 'USD';
    const rate = CURRENCY_RATES[currency] || 1;
    return Object.entries(TIERS).map(([key, tier]) => ({
      tier: key,
      label: tier.label,
      price: Math.round(tier.usd * rate),
      currency,
      features: this.getFeatures(key),
    }));
  }

  private getFeatures(tier: string): string[] {
    const base = ['✓ Verified badge', '✓ Priority feed ranking', '✓ Basic analytics'];
    if (tier === 'elite' || tier === 'legend') base.push('✓ AI headline tools', '✓ Report scheduling', '✓ Higher tip visibility');
    if (tier === 'legend') base.push('✓ Media licensing priority', '✓ Newsroom connections', '✓ Dedicated support');
    return base;
  }

  async subscribe(userId: string, tier: string, email: string) {
    if (!TIERS[tier as keyof typeof TIERS]) throw new BadRequestException('Invalid tier');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const currency = COUNTRY_CURRENCY[user.country] || 'USD';
    const rate = CURRENCY_RATES[currency] || 1;
    const amount = Math.round(TIERS[tier as keyof typeof TIERS].usd * rate);
    const reference = this.paystackService.generateReference();

    const payment = await this.paystackService.initializePayment({
      email,
      amount: amount * 100,
      currency,
      reference,
      metadata: { type: 'reporter_subscription', userId, tier },
    });

    return { paymentUrl: payment.data?.authorization_url, reference, tier, amount, currency };
  }

  async activateSubscription(userId: string, tier: string) {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    await this.userRepo.update(userId, { subscriptionTier: tier, subscriptionExpires: expires });
  }

  async getMySubscription(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId }, select: ['id', 'subscriptionTier', 'subscriptionExpires'] });
    if (!user) throw new NotFoundException('User not found');
    const isActive = user.subscriptionExpires && new Date(user.subscriptionExpires) > new Date();
    return { tier: isActive ? user.subscriptionTier : 'free', expires: user.subscriptionExpires, active: !!isActive };
  }

  async handleWebhook(metadata: any) {
    if (metadata?.type !== 'reporter_subscription') return;
    await this.activateSubscription(metadata.userId, metadata.tier);
  }
}
