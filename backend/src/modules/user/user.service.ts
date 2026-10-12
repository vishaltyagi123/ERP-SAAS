import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto, UpdateUserDto, InviteUserDto } from './dto';
import {
  getPaginationParams,
  createPaginatedResult,
  PaginationParams,
} from '../../common/utils/pagination.util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, params: PaginationParams) {
    const { page, limit, skip } = getPaginationParams(params);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          isActive: true,
          isEmailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          branch: {
            select: {
              id: true,
              name: true,
            },
          },
          userRoles: {
            include: {
              role: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.user.count({ where: { organizationId } }),
    ]);

    const formattedUsers = users.map((user) => ({
      ...user,
      roles: user.userRoles.map((ur) => ur.role),
    }));

    return createPaginatedResult(formattedUsers, total, page, limit);
  }

  async findById(id: string, organizationId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        isActive: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        userRoles: {
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
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      roles: user.userRoles.map((ur) => ur.role),
      permissions: [
        ...new Set(
          user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.code),
          ),
        ),
      ],
    };
  }

  async create(organizationId: string, createDto: CreateUserDto) {
    // Check subscription limits
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (subscription && subscription.plan.maxUsers !== -1) {
      const currentUserCount = await this.prisma.user.count({
        where: { organizationId },
      });

      if (currentUserCount >= subscription.plan.maxUsers) {
        throw new ForbiddenException(
          'Maximum users limit reached for your subscription plan',
        );
      }
    }

    // Check for existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const { roleIds, ...userData } = createDto;

    // Create user with roles
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        organizationId,
        userRoles: {
          create: roleIds.map((roleId) => ({
            roleId,
          })),
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // TODO: Send welcome email with temporary password

    return {
      ...user,
      tempPassword, // Return for display (only once)
      roles: user.userRoles.map((ur) => ur.role),
    };
  }

  async update(id: string, organizationId: string, updateDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { roleIds, ...userData } = updateDto;

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    // Update roles if provided
    if (roleIds) {
      // Delete existing roles
      await this.prisma.userRole.deleteMany({
        where: { userId: id },
      });

      // Create new roles
      await this.prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId: id,
          roleId,
        })),
      });
    }

    return this.findById(id, organizationId);
  }

  async deactivate(id: string, organizationId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activate(id: string, organizationId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async resetPassword(id: string, organizationId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    // TODO: Send password reset email

    return { tempPassword };
  }
}
