import { Module } from '@nestjs/common';
import { ErpTypeController } from './erp-type.controller';
import { ErpTypeService } from './erp-type.service';
import { ModuleRegistryController } from './module-registry.controller';
import { ModuleRegistryService } from './module-registry.service';

@Module({
  controllers: [ErpTypeController, ModuleRegistryController],
  providers: [ErpTypeService, ModuleRegistryService],
  exports: [ErpTypeService, ModuleRegistryService],
})
export class ErpRegistryModule {}
