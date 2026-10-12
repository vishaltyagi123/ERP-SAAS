import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Menu')
@Controller({ path: 'menu', version: '1' })
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get menu for current user' })
  @ApiResponse({ status: 200, description: 'User menu' })
  async getMenuForUser(
    @CurrentUser() user: CurrentUserData,
    @CurrentOrg() organizationId: string,
  ) {
    return this.menuService.buildMenuForUser(user.id, organizationId);
  }

  @Public()
  @Get('erp-type/:code')
  @ApiOperation({ summary: 'Get static menu structure for ERP type' })
  @ApiResponse({ status: 200, description: 'Menu structure' })
  async getStaticMenu(@Param('code') code: string) {
    return this.menuService.getStaticMenuForErpType(code);
  }
}
