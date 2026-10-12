import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  controllers: [OrganizationController, BranchController],
  providers: [OrganizationService, BranchService],
  exports: [OrganizationService, BranchService],
})
export class OrganizationModule {}
