import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities';

@Injectable()
export class GovGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) throw new ForbiddenException('Not authenticated');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || !['admin', 'government_agency'].includes(user.role)) {
      throw new ForbiddenException('Government access required');
    }

    return true;
  }
}
