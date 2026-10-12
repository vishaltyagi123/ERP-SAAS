import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ModuleRegistryService } from './module-registry.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('ERP Registry')
@Controller({ path: 'modules', version: '1' })
export class ModuleRegistryController {
  constructor(private readonly moduleRegistryService: ModuleRegistryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all available modules' })
  @ApiResponse({ status: 200, description: 'List of all modules' })
  async findAll() {
    return this.moduleRegistryService.findAll();
  }

  @Public()
  @Get('core')
  @ApiOperation({ summary: 'Get core modules (included in all ERPs)' })
  @ApiResponse({ status: 200, description: 'List of core modules' })
  async getCoreModules() {
    return this.moduleRegistryService.getCoreModules();
  }

  @Public()
  @Get('category/:category')
  @ApiOperation({ summary: 'Get modules by category' })
  @ApiResponse({ status: 200, description: 'List of modules in category' })
  async findByCategory(@Param('category') category: string) {
    return this.moduleRegistryService.findByCategory(category);
  }

  @Public()
  @Get(':code')
  @ApiOperation({ summary: 'Get module by code' })
  @ApiResponse({ status: 200, description: 'Module details' })
  async findByCode(@Param('code') code: string) {
    return this.moduleRegistryService.findByCode(code);
  }

  @Public()
  @Get(':code/dependencies')
  @ApiOperation({ summary: 'Check module dependencies' })
  @ApiResponse({ status: 200, description: 'Module dependencies' })
  async checkDependencies(@Param('code') code: string) {
    return this.moduleRegistryService.checkDependencies(code);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get permissions for a module' })
  @ApiResponse({ status: 200, description: 'List of module permissions' })
  async getModulePermissions(@Param('id') id: string) {
    return this.moduleRegistryService.getModulePermissions(id);
  }
}
