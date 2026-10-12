import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.getAllAndOverride<string>(
      MODULE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredModule) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.organizationId) {
      throw new ForbiddenException('Organization context required');
    }

    // Platform admins bypass module checks
    if (user.isPlatformAdmin) {
      return true;
    }

    // Check if module is enabled for this organization
    const organizationModule = await this.prisma.organizationModule.findFirst({
      where: {
        organizationId: user.organizationId,
        module: { code: requiredModule },
        isEnabled: true,
      },
    });

    if (!organizationModule) {
      throw new ForbiddenException(
        `Module '${requiredModule}' is not enabled for your organization`,
      );
    }

    return true;
  }
}
