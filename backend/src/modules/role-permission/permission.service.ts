import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany({
      include: {
        module: {
          select: {
            id: true,
            code: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: [{ module: { sortOrder: 'asc' } }, { code: 'asc' }],
    });
  }

  async findByModule(moduleCode: string) {
    return this.prisma.permission.findMany({
      where: {
        module: { code: moduleCode },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findByOrganizationModules(organizationId: string) {
    // Get enabled modules for organization
    const enabledModules = await this.prisma.organizationModule.findMany({
      where: { organizationId, isEnabled: true },
      select: { moduleId: true },
    });

    const moduleIds = enabledModules.map((m) => m.moduleId);

    // Get permissions for enabled modules + platform permissions
    return this.prisma.permission.findMany({
      where: {
        OR: [
          { moduleId: { in: moduleIds } },
          { moduleId: null }, // Platform-wide permissions
        ],
      },
      include: {
        module: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async getUserPermissions(userId: string) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissions = new Set<string>();
    userRoles.forEach((userRole) => {
      userRole.role.rolePermissions.forEach((rp) => {
        permissions.add(rp.permission.code);
      });
    });

    return Array.from(permissions);
  }

  async checkUserPermission(userId: string, permissionCode: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permissionCode);
  }
}
