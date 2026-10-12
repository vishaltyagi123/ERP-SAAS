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
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Roles & Permissions')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'roles', version: '1' })
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  async findAll(@CurrentOrg() organizationId: string) {
    return this.roleService.findAll(organizationId);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all available permissions for organization' })
  @ApiResponse({ status: 200, description: 'List of permissions' })
  async getAvailablePermissions(@CurrentOrg() organizationId: string) {
    return this.permissionService.findByOrganizationModules(organizationId);
  }

  @Get('permissions/all')
  @ApiOperation({ summary: 'Get all permissions in system' })
  @ApiResponse({ status: 200, description: 'List of all permissions' })
  async getAllPermissions() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role details' })
  async findById(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.roleService.findById(id, organizationId);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('role.create')
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  async create(
    @CurrentOrg() organizationId: string,
    @Body() body: { code: string; name: string; description?: string; permissionIds: string[] },
  ) {
    return this.roleService.create(organizationId, body);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('role.update')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  async update(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
    @Body() body: { name?: string; description?: string; permissionIds?: string[] },
  ) {
    return this.roleService.update(id, organizationId, body);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('role.delete')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  async delete(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.roleService.delete(id, organizationId);
  }

  @Put(':id/permissions')
  @UseGuards(PermissionsGuard)
  @Permissions('role.update')
  @ApiOperation({ summary: 'Assign permissions to role' })
  @ApiResponse({ status: 200, description: 'Permissions assigned' })
  async assignPermissions(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
    @Body() body: { permissionIds: string[] },
  ) {
    return this.roleService.assignPermissions(id, organizationId, body.permissionIds);
  }
}
