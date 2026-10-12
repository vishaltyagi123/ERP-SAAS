import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ErpTypeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.erpType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        erpTypeModules: {
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
        },
        _count: {
          select: {
            organizations: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    const erpType = await this.prisma.erpType.findUnique({
      where: { code },
      include: {
        erpTypeModules: {
          include: {
            module: true,
          },
          orderBy: {
            module: { sortOrder: 'asc' },
          },
        },
      },
    });

    if (!erpType) {
      throw new NotFoundException('ERP type not found');
    }

    return erpType;
  }

  async findById(id: string) {
    const erpType = await this.prisma.erpType.findUnique({
      where: { id },
      include: {
        erpTypeModules: {
          include: {
            module: true,
          },
        },
      },
    });

    if (!erpType) {
      throw new NotFoundException('ERP type not found');
    }

    return erpType;
  }

  async getModulesForErpType(erpTypeId: string) {
    const erpTypeModules = await this.prisma.erpTypeModule.findMany({
      where: { erpTypeId },
      include: {
        module: true,
      },
      orderBy: [
        { isRequired: 'desc' },
        { module: { sortOrder: 'asc' } },
      ],
    });

    return erpTypeModules.map((etm) => ({
      ...etm.module,
      isRequired: etm.isRequired,
      isDefault: etm.isDefault,
    }));
  }

  async getDefaultModules(erpTypeId: string) {
    const modules = await this.prisma.erpTypeModule.findMany({
      where: {
        erpTypeId,
        isDefault: true,
      },
      include: {
        module: true,
      },
    });

    return modules.map((m) => m.module);
  }

  async getRequiredModules(erpTypeId: string) {
    const modules = await this.prisma.erpTypeModule.findMany({
      where: {
        erpTypeId,
        isRequired: true,
      },
      include: {
        module: true,
      },
    });

    return modules.map((m) => m.module);
  }
}
