import {
  Controller,
  Get,
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
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Subscriptions')
@Controller({ path: 'subscriptions', version: '1' })
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Public()
  @Get('plans')
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiResponse({ status: 200, description: 'List of plans' })
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Public()
  @Get('plans/:id')
  @ApiOperation({ summary: 'Get plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan details' })
  async getPlanById(@Param('id') id: string) {
    return this.subscriptionService.getPlanById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current subscription' })
  @ApiResponse({ status: 200, description: 'Current subscription' })
  async getCurrentSubscription(@CurrentOrg() organizationId: string) {
    return this.subscriptionService.getCurrentSubscription(organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('limits')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check subscription limits' })
  @ApiResponse({ status: 200, description: 'Subscription limits' })
  async checkLimits(@CurrentOrg() organizationId: string) {
    return this.subscriptionService.checkSubscriptionLimits(organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Subscribe to a plan' })
  @ApiResponse({ status: 201, description: 'Subscription created' })
  async subscribe(
    @CurrentOrg() organizationId: string,
    @Body() body: { planId: string; billingCycle?: 'monthly' | 'yearly' },
  ) {
    return this.subscriptionService.createSubscription(
      organizationId,
      body.planId,
      body.billingCycle,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-trial')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Start a free trial' })
  @ApiResponse({ status: 201, description: 'Trial started' })
  async startTrial(
    @CurrentOrg() organizationId: string,
    @Body() body: { planId: string },
  ) {
    return this.subscriptionService.createTrialSubscription(
      organizationId,
      body.planId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upgrade subscription plan' })
  @ApiResponse({ status: 200, description: 'Plan upgraded' })
  async upgrade(
    @CurrentOrg() organizationId: string,
    @Body() body: { planId: string },
  ) {
    return this.subscriptionService.upgradePlan(organizationId, body.planId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancel(@CurrentOrg() organizationId: string) {
    return this.subscriptionService.cancelSubscription(organizationId);
  }
}
