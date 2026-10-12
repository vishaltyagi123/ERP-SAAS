import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@ApiTags('Branches')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'branches', version: '1' })
@UseGuards(JwtAuthGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @ApiOperation({ summary: 'Get all branches' })
  @ApiResponse({ status: 200, description: 'List of branches' })
  async findAll(@CurrentOrg() organizationId: string) {
    return this.branchService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiResponse({ status: 200, description: 'Branch details' })
  async findById(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.branchService.findById(id, organizationId);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('branch.create')
  @ApiOperation({ summary: 'Create new branch' })
  @ApiResponse({ status: 201, description: 'Branch created' })
  async create(
    @CurrentOrg() organizationId: string,
    @Body() createDto: CreateBranchDto,
  ) {
    return this.branchService.create(organizationId, createDto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('branch.update')
  @ApiOperation({ summary: 'Update branch' })
  @ApiResponse({ status: 200, description: 'Branch updated' })
  async update(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
    @Body() updateDto: UpdateBranchDto,
  ) {
    return this.branchService.update(id, organizationId, updateDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('branch.delete')
  @ApiOperation({ summary: 'Delete branch' })
  @ApiResponse({ status: 200, description: 'Branch deleted' })
  async delete(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.branchService.delete(id, organizationId);
  }
}
