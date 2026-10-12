import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.role.findMany({
      where: {
        OR: [
          { organizationId },
          { organizationId: null, isSystem: true }, // System roles
        ],
      },
      include: {
        _count: {
          select: {
            userRoles: true,
          },
        },
        rolePermissions: {
          include: {
            permission: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
  }

  async findById(id: string, organizationId: string) {
    const role = await this.prisma.role.findFirst({
      where: {
        id,
        OR: [{ organizationId }, { organizationId: null, isSystem: true }],
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      ...role,
      permissions: role.rolePermissions.map((rp) => rp.permission),
    };
  }

  async create(
    organizationId: string,
    data: { code: string; name: string; description?: string; permissionIds: string[] },
  ) {
    const { permissionIds, ...roleData } = data;

    // Check for duplicate code
    const existingRole = await this.prisma.role.findFirst({
      where: { organizationId, code: roleData.code },
    });

    if (existingRole) {
      throw new ConflictException('Role code already exists');
    }

    return this.prisma.role.create({
      data: {
        ...roleData,
        organizationId,
        rolePermissions: {
          create: permissionIds.map((permissionId) => ({
            permissionId,
          })),
        },
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    organizationId: string,
    data: { name?: string; description?: string; permissionIds?: string[] },
  ) {
    const role = await this.prisma.role.findFirst({
      where: { id, organizationId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be modified');
    }

    const { permissionIds, ...roleData } = data;

    // Update role
    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: roleData,
    });

    // Update permissions if provided
    if (permissionIds) {
      await this.prisma.rolePermission.deleteMany({
        where: { roleId: id },
      });

      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: id,
          permissionId,
        })),
      });
    }

    return this.findById(id, organizationId);
  }

  async delete(id: string, organizationId: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, organizationId },
      include: {
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be deleted');
    }

    if (role._count.userRoles > 0) {
      throw new ForbiddenException(
        'Cannot delete role with assigned users. Please reassign users first.',
      );
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignPermissions(id: string, organizationId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findFirst({
      where: { id, organizationId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Clear existing permissions
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // Assign new permissions
    await this.prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId: id,
        permissionId,
      })),
    });

    return this.findById(id, organizationId);
  }
}
