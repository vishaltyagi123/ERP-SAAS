import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        erpType: {
          select: {
            id: true,
            code: true,
            name: true,
            icon: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
        _count: {
          select: {
            users: true,
            branches: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findBySlug(slug: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      include: {
        erpType: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(id: string, updateDto: UpdateOrganizationDto, userId: string) {
    // Verify organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.prisma.organization.update({
      where: { id },
      data: updateDto,
    });
  }

  async getEnabledModules(organizationId: string) {
    const modules = await this.prisma.organizationModule.findMany({
      where: {
        organizationId,
        isEnabled: true,
      },
      include: {
        module: {
          select: {
            id: true,
            code: true,
            name: true,
            category: true,
            icon: true,
          },
        },
      },
    });

    return modules.map((m) => m.module);
  }

  async enableModule(organizationId: string, moduleId: string) {
    // Check if module exists
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Check subscription limits
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (subscription && subscription.plan.maxModules !== -1) {
      const currentModuleCount = await this.prisma.organizationModule.count({
        where: { organizationId, isEnabled: true },
      });

      if (currentModuleCount >= subscription.plan.maxModules) {
        throw new ForbiddenException(
          'Maximum modules limit reached for your subscription plan',
        );
      }
    }

    // Upsert organization module
    return this.prisma.organizationModule.upsert({
      where: {
        organizationId_moduleId: {
          organizationId,
          moduleId,
        },
      },
      update: { isEnabled: true },
      create: {
        organizationId,
        moduleId,
        isEnabled: true,
      },
    });
  }

  async disableModule(organizationId: string, moduleId: string) {
    // Check if module is required
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    const erpTypeModule = await this.prisma.erpTypeModule.findFirst({
      where: {
        erpTypeId: organization?.erpTypeId,
        moduleId,
        isRequired: true,
      },
    });

    if (erpTypeModule) {
      throw new ForbiddenException(
        'This module is required for your ERP type and cannot be disabled',
      );
    }

    return this.prisma.organizationModule.update({
      where: {
        organizationId_moduleId: {
          organizationId,
          moduleId,
        },
      },
      data: { isEnabled: false },
    });
  }

  async completeOnboarding(organizationId: string) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: { isOnboarded: true },
    });
  }

  async getStats(organizationId: string) {
    const [
      userCount,
      branchCount,
      moduleCount,
    ] = await Promise.all([
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.branch.count({ where: { organizationId } }),
      this.prisma.organizationModule.count({
        where: { organizationId, isEnabled: true },
      }),
    ]);

    return {
      users: userCount,
      branches: branchCount,
      enabledModules: moduleCount,
    };
  }
}
