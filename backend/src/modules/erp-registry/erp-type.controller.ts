import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErpTypeService } from './erp-type.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('ERP Registry')
@Controller({ path: 'erp-types', version: '1' })
export class ErpTypeController {
  constructor(private readonly erpTypeService: ErpTypeService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all available ERP types' })
  @ApiResponse({ status: 200, description: 'List of ERP types with their modules' })
  async findAll() {
    return this.erpTypeService.findAll();
  }

  @Public()
  @Get(':code')
  @ApiOperation({ summary: 'Get ERP type by code' })
  @ApiResponse({ status: 200, description: 'ERP type details' })
  async findByCode(@Param('code') code: string) {
    return this.erpTypeService.findByCode(code);
  }

  @Public()
  @Get(':id/modules')
  @ApiOperation({ summary: 'Get available modules for an ERP type' })
  @ApiResponse({ status: 200, description: 'List of modules' })
  async getModules(@Param('id') id: string) {
    return this.erpTypeService.getModulesForErpType(id);
  }

  @Public()
  @Get(':id/modules/default')
  @ApiOperation({ summary: 'Get default modules for an ERP type' })
  @ApiResponse({ status: 200, description: 'List of default modules' })
  async getDefaultModules(@Param('id') id: string) {
    return this.erpTypeService.getDefaultModules(id);
  }
}
