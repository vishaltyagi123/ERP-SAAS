import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.organizationId) {
      return true; // Let other guards handle this
    }

    // Platform admins bypass subscription checks
    if (user.isPlatformAdmin) {
      return true;
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: user.organizationId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new ForbiddenException('No active subscription found');
    }

    // Check subscription status
    if (subscription.status === 'expired') {
      throw new ForbiddenException(
        'Your subscription has expired. Please renew to continue.',
      );
    }

    if (subscription.status === 'cancelled') {
      // Allow access until period end
      if (new Date() > subscription.currentPeriodEnd) {
        throw new ForbiddenException(
          'Your subscription has been cancelled and the access period has ended.',
        );
      }
    }

    // Attach subscription info to request for later use
    request.subscription = subscription;

    return true;
  }
}
