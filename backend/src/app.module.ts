import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Database
import { PrismaModule } from './database/prisma.module';

// Platform Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { ErpRegistryModule } from './modules/erp-registry/erp-registry.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { MenuModule } from './modules/menu/menu.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';

// Core Business Modules
import { FinanceModule } from './modules/core/finance/finance.module';
import { InventoryModule } from './modules/core/inventory/inventory.module';
import { HrModule } from './modules/core/hr/hr.module';
import { ProcurementModule } from './modules/core/procurement/procurement.module';
import { SalesModule } from './modules/core/sales/sales.module';

// Industry Modules
import { SchoolModule } from './modules/industry/school/school.module';
import { ManufacturingModule } from './modules/industry/manufacturing/manufacturing.module';
import { RetailModule } from './modules/industry/retail/retail.module';
import { HospitalModule } from './modules/industry/hospital/hospital.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Event Emitter for internal events
    EventEmitterModule.forRoot(),

    // Database
    PrismaModule,

    // Platform Modules (Always loaded)
    AuthModule,
    UserModule,
    OrganizationModule,
    RolePermissionModule,
    ErpRegistryModule,
    SubscriptionModule,
    MenuModule,
    SettingsModule,
    AuditLogModule,

    // Core Business Modules
    FinanceModule,
    InventoryModule,
    HrModule,
    ProcurementModule,
    SalesModule,

    // Industry Modules
    SchoolModule,
    ManufacturingModule,
    RetailModule,
    HospitalModule,
  ],
})
export class AppModule {}
