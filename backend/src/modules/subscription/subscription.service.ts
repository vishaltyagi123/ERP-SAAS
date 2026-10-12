import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getPlanById(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async getCurrentSubscription(organizationId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!subscription) {
      return null;
    }

    // Calculate usage
    const [userCount, branchCount, moduleCount] = await Promise.all([
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.branch.count({ where: { organizationId } }),
      this.prisma.organizationModule.count({
        where: { organizationId, isEnabled: true },
      }),
    ]);

    return {
      ...subscription,
      usage: {
        users: { current: userCount, limit: subscription.plan.maxUsers },
        branches: { current: branchCount, limit: subscription.plan.maxBranches },
        modules: { current: moduleCount, limit: subscription.plan.maxModules },
      },
    };
  }

  async createSubscription(
    organizationId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly',
  ) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check if subscription already exists
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (existingSubscription) {
      throw new BadRequestException('Organization already has a subscription');
    }

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    return this.prisma.subscription.create({
      data: {
        organizationId,
        planId,
        billingCycle,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      include: {
        plan: true,
      },
    });
  }

  async createTrialSubscription(organizationId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial

    return this.prisma.subscription.create({
      data: {
        organizationId,
        planId,
        billingCycle: 'monthly',
        status: 'trial',
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        trialEndsAt: trialEnd,
      },
      include: {
        plan: true,
      },
    });
  }

  async upgradePlan(organizationId: string, newPlanId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const newPlan = await this.prisma.plan.findUnique({
      where: { id: newPlanId },
    });

    if (!newPlan) {
      throw new NotFoundException('Plan not found');
    }

    return this.prisma.subscription.update({
      where: { organizationId },
      data: {
        planId: newPlanId,
        updatedAt: new Date(),
      },
      include: {
        plan: true,
      },
    });
  }

  async cancelSubscription(organizationId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { organizationId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
    });
  }

  async recordPayment(
    subscriptionId: string,
    amount: number,
    razorpayPaymentId?: string,
    razorpayOrderId?: string,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Record payment
    const payment = await this.prisma.subscriptionPayment.create({
      data: {
        subscriptionId,
        amount,
        status: 'success',
        razorpayPaymentId,
        razorpayOrderId,
        paidAt: new Date(),
      },
    });

    // Extend subscription period
    const currentEnd = new Date(subscription.currentPeriodEnd);
    const newEnd = new Date(currentEnd);
    if (subscription.billingCycle === 'monthly') {
      newEnd.setMonth(newEnd.getMonth() + 1);
    } else {
      newEnd.setFullYear(newEnd.getFullYear() + 1);
    }

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'active',
        currentPeriodStart: currentEnd,
        currentPeriodEnd: newEnd,
      },
    });

    return payment;
  }

  async checkSubscriptionLimits(organizationId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (!subscription) {
      return { canAdd: false, reason: 'No subscription' };
    }

    const [userCount, branchCount, moduleCount] = await Promise.all([
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.branch.count({ where: { organizationId } }),
      this.prisma.organizationModule.count({
        where: { organizationId, isEnabled: true },
      }),
    ]);

    return {
      users: {
        current: userCount,
        limit: subscription.plan.maxUsers,
        canAdd: subscription.plan.maxUsers === -1 || userCount < subscription.plan.maxUsers,
      },
      branches: {
        current: branchCount,
        limit: subscription.plan.maxBranches,
        canAdd: subscription.plan.maxBranches === -1 || branchCount < subscription.plan.maxBranches,
      },
      modules: {
        current: moduleCount,
        limit: subscription.plan.maxModules,
        canAdd: subscription.plan.maxModules === -1 || moduleCount < subscription.plan.maxModules,
      },
    };
  }
}
