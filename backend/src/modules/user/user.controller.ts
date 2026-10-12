import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PaginationParams } from '../../common/utils/pagination.util';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('user.view')
  @ApiOperation({ summary: 'Get all users in organization' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @CurrentOrg() organizationId: string,
    @Query() query: PaginationParams,
  ) {
    return this.userService.findAll(organizationId, query);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('user.view')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  async findById(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.userService.findById(id, organizationId);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('user.create')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  async create(
    @CurrentOrg() organizationId: string,
    @Body() createDto: CreateUserDto,
  ) {
    return this.userService.create(organizationId, createDto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('user.update')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async update(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.userService.update(id, organizationId, updateDto);
  }

  @Post(':id/deactivate')
  @UseGuards(PermissionsGuard)
  @Permissions('user.update')
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiResponse({ status: 200, description: 'User deactivated' })
  async deactivate(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.userService.deactivate(id, organizationId);
  }

  @Post(':id/activate')
  @UseGuards(PermissionsGuard)
  @Permissions('user.update')
  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, description: 'User activated' })
  async activate(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.userService.activate(id, organizationId);
  }

  @Post(':id/reset-password')
  @UseGuards(PermissionsGuard)
  @Permissions('user.update')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset' })
  async resetPassword(
    @Param('id') id: string,
    @CurrentOrg() organizationId: string,
  ) {
    return this.userService.resetPassword(id, organizationId);
  }
}
