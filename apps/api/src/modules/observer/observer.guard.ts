import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObserverEntity } from '../../database/entities/observer.entity';

@Injectable()
export class ObserverGuard implements CanActivate {
  constructor(
    @InjectRepository(ObserverEntity)
    private readonly observerRepo: Repository<ObserverEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const country = request.query?.country || request.body?.country;

    if (!userId) throw new ForbiddenException('Not authenticated');
    if (!country) throw new ForbiddenException('Country required');

    const observer = await this.observerRepo.findOne({
      where: { userId, country, status: 'observer_active' },
    });

    if (!observer) throw new ForbiddenException('No active observer subscription');

    if (observer.expiresAt && new Date() > observer.expiresAt) {
      observer.status = 'observer_expired';
      await this.observerRepo.save(observer);
      throw new ForbiddenException('Subscription expired');
    }

    request.observer = observer;
    return true;
  }
}
