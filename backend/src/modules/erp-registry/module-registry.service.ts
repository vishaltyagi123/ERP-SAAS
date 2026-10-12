import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ModuleRegistryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.module.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async findByCode(code: string) {
    const module = await this.prisma.module.findUnique({
      where: { code },
      include: {
        permissions: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async findById(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        permissions: true,
        erpTypeModules: {
          include: {
            erpType: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async findByCategory(category: string) {
    return this.prisma.module.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getCoreModules() {
    return this.prisma.module.findMany({
      where: {
        isCore: true,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getModulesByErpType(erpTypeCode: string) {
    const erpType = await this.prisma.erpType.findUnique({
      where: { code: erpTypeCode },
    });

    if (!erpType) {
      throw new NotFoundException('ERP type not found');
    }

    return this.prisma.erpTypeModule.findMany({
      where: { erpTypeId: erpType.id },
      include: {
        module: true,
      },
      orderBy: {
        module: { sortOrder: 'asc' },
      },
    });
  }

  async getModulePermissions(moduleId: string) {
    return this.prisma.permission.findMany({
      where: { moduleId },
      orderBy: { code: 'asc' },
    });
  }

  // Check if a module has dependencies
  async checkDependencies(moduleCode: string) {
    const module = await this.prisma.module.findUnique({
      where: { code: moduleCode },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (!module.dependencies || module.dependencies.length === 0) {
      return { hasDependencies: false, dependencies: [] };
    }

    const dependencies = await this.prisma.module.findMany({
      where: {
        code: { in: module.dependencies },
      },
      select: {
        code: true,
        name: true,
      },
    });

    return {
      hasDependencies: true,
      dependencies,
    };
  }
}
