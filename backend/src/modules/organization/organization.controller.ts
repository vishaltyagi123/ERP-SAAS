import {
  Controller,
  Get,
  Put,
  Post,
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
import { OrganizationService } from './organization.service';
import { UpdateOrganizationDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@ApiTags('Organizations')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'organizations', version: '1' })
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current organization details' })
  @ApiResponse({ status: 200, description: 'Organization details' })
  async getCurrentOrganization(@CurrentOrg() organizationId: string) {
    return this.organizationService.findById(organizationId);
  }

  @Put('current')
  @UseGuards(PermissionsGuard)
  @Permissions('organization.update')
  @ApiOperation({ summary: 'Update current organization' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  async updateOrganization(
    @CurrentOrg() organizationId: string,
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(organizationId, updateDto, user.id);
  }

  @Get('current/modules')
  @ApiOperation({ summary: 'Get enabled modules for organization' })
  @ApiResponse({ status: 200, description: 'List of enabled modules' })
  async getEnabledModules(@CurrentOrg() organizationId: string) {
    return this.organizationService.getEnabledModules(organizationId);
  }

  @Post('current/modules/:moduleId/enable')
  @UseGuards(PermissionsGuard)
  @Permissions('organization.update')
  @ApiOperation({ summary: 'Enable a module for organization' })
  @ApiResponse({ status: 200, description: 'Module enabled' })
  async enableModule(
    @CurrentOrg() organizationId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.organizationService.enableModule(organizationId, moduleId);
  }

  @Post('current/modules/:moduleId/disable')
  @UseGuards(PermissionsGuard)
  @Permissions('organization.update')
  @ApiOperation({ summary: 'Disable a module for organization' })
  @ApiResponse({ status: 200, description: 'Module disabled' })
  async disableModule(
    @CurrentOrg() organizationId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.organizationService.disableModule(organizationId, moduleId);
  }

  @Post('current/complete-onboarding')
  @ApiOperation({ summary: 'Mark organization onboarding as complete' })
  @ApiResponse({ status: 200, description: 'Onboarding completed' })
  async completeOnboarding(@CurrentOrg() organizationId: string) {
    return this.organizationService.completeOnboarding(organizationId);
  }

  @Get('current/stats')
  @ApiOperation({ summary: 'Get organization statistics' })
  @ApiResponse({ status: 200, description: 'Organization stats' })
  async getStats(@CurrentOrg() organizationId: string) {
    return this.organizationService.getStats(organizationId);
  }
}
