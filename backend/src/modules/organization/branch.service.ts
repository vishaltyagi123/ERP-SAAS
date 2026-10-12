import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.branch.findMany({
      where: { organizationId },
      orderBy: [{ isHeadOffice: 'desc' }, { name: 'asc' }],
    });
  }

  async findById(id: string, organizationId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, organizationId },
      include: {
        _count: {
          select: {
            users: true,
            warehouses: true,
          },
        },
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async create(organizationId: string, createDto: CreateBranchDto) {
    // Check subscription limits
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (subscription && subscription.plan.maxBranches !== -1) {
      const currentBranchCount = await this.prisma.branch.count({
        where: { organizationId },
      });

      if (currentBranchCount >= subscription.plan.maxBranches) {
        throw new ForbiddenException(
          'Maximum branches limit reached for your subscription plan',
        );
      }
    }

    // Check for duplicate code
    const existingBranch = await this.prisma.branch.findFirst({
      where: { organizationId, code: createDto.code },
    });

    if (existingBranch) {
      throw new ConflictException('Branch code already exists');
    }

    // If this is being set as head office, remove from existing
    if (createDto.isHeadOffice) {
      await this.prisma.branch.updateMany({
        where: { organizationId, isHeadOffice: true },
        data: { isHeadOffice: false },
      });
    }

    return this.prisma.branch.create({
      data: {
        ...createDto,
        organizationId,
      },
    });
  }

  async update(
    id: string,
    organizationId: string,
    updateDto: UpdateBranchDto,
  ) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, organizationId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return this.prisma.branch.update({
      where: { id },
      data: updateDto,
    });
  }

  async delete(id: string, organizationId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, organizationId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    if (branch.isHeadOffice) {
      throw new ForbiddenException('Cannot delete head office branch');
    }

    if (branch._count.users > 0) {
      throw new ForbiddenException(
        'Cannot delete branch with assigned users. Please reassign users first.',
      );
    }

    return this.prisma.branch.delete({
      where: { id },
    });
  }
}
