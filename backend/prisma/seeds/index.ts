import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Seed ERP Types
  console.log('📦 Seeding ERP Types...');
  const erpTypes = await Promise.all([
    prisma.erpType.upsert({
      where: { code: 'school' },
      update: {},
      create: {
        code: 'school',
        name: 'School ERP',
        description: 'Complete school management system for K-12 and higher education',
        icon: 'GraduationCap',
        sortOrder: 1,
      },
    }),
    prisma.erpType.upsert({
      where: { code: 'manufacturing' },
      update: {},
      create: {
        code: 'manufacturing',
        name: 'Manufacturing ERP',
        description: 'Production planning, inventory, and quality management',
        icon: 'Factory',
        sortOrder: 2,
      },
    }),
    prisma.erpType.upsert({
      where: { code: 'retail' },
      update: {},
      create: {
        code: 'retail',
        name: 'Retail ERP',
        description: 'Point of sale, inventory, and customer management',
        icon: 'Store',
        sortOrder: 3,
      },
    }),
    prisma.erpType.upsert({
      where: { code: 'hospital' },
      update: {},
      create: {
        code: 'hospital',
        name: 'Hospital ERP',
        description: 'Patient management, appointments, and medical records',
        icon: 'Hospital',
        sortOrder: 4,
      },
    }),
    prisma.erpType.upsert({
      where: { code: 'general' },
      update: {},
      create: {
        code: 'general',
        name: 'General Business ERP',
        description: 'Finance, HR, and inventory for any business',
        icon: 'Building',
        sortOrder: 5,
      },
    }),
  ]);
  console.log(`   ✓ Created ${erpTypes.length} ERP types\n`);

  // Seed Modules
  console.log('📦 Seeding Modules...');
  const modules = await Promise.all([
    // Platform modules
    prisma.module.upsert({
      where: { code: 'organization' },
      update: {},
      create: {
        code: 'organization',
        name: 'Organization',
        description: 'Organization settings and configuration',
        category: 'platform',
        icon: 'Building',
        isCore: true,
        sortOrder: 1,
      },
    }),
    prisma.module.upsert({
      where: { code: 'users' },
      update: {},
      create: {
        code: 'users',
        name: 'User Management',
        description: 'User and role management',
        category: 'platform',
        icon: 'Users',
        isCore: true,
        sortOrder: 2,
      },
    }),

    // Core modules
    prisma.module.upsert({
      where: { code: 'finance' },
      update: {},
      create: {
        code: 'finance',
        name: 'Finance',
        description: 'Accounting, invoicing, and payments',
        category: 'core',
        icon: 'IndianRupee',
        isCore: false,
        sortOrder: 10,
      },
    }),
    prisma.module.upsert({
      where: { code: 'inventory' },
      update: {},
      create: {
        code: 'inventory',
        name: 'Inventory',
        description: 'Products, warehouses, and stock management',
        category: 'core',
        icon: 'Package',
        isCore: false,
        sortOrder: 11,
      },
    }),
    prisma.module.upsert({
      where: { code: 'hr' },
      update: {},
      create: {
        code: 'hr',
        name: 'HR & Payroll',
        description: 'Employee management, attendance, and payroll',
        category: 'core',
        icon: 'Users',
        isCore: false,
        sortOrder: 12,
      },
    }),
    prisma.module.upsert({
      where: { code: 'procurement' },
      update: {},
      create: {
        code: 'procurement',
        name: 'Procurement',
        description: 'Vendor management and purchase orders',
        category: 'core',
        icon: 'ShoppingCart',
        isCore: false,
        dependencies: ['inventory'],
        sortOrder: 13,
      },
    }),
    prisma.module.upsert({
      where: { code: 'sales' },
      update: {},
      create: {
        code: 'sales',
        name: 'Sales',
        description: 'Customer management and sales orders',
        category: 'core',
        icon: 'TrendingUp',
        isCore: false,
        dependencies: ['inventory'],
        sortOrder: 14,
      },
    }),

    // School modules
    prisma.module.upsert({
      where: { code: 'students' },
      update: {},
      create: {
        code: 'students',
        name: 'Student Management',
        description: 'Student admissions, profiles, and enrollment',
        category: 'school',
        icon: 'Users',
        isCore: false,
        sortOrder: 20,
      },
    }),
    prisma.module.upsert({
      where: { code: 'teachers' },
      update: {},
      create: {
        code: 'teachers',
        name: 'Teacher Management',
        description: 'Teacher profiles and assignments',
        category: 'school',
        icon: 'UserCheck',
        isCore: false,
        sortOrder: 21,
      },
    }),
    prisma.module.upsert({
      where: { code: 'academics' },
      update: {},
      create: {
        code: 'academics',
        name: 'Academics',
        description: 'Classes, subjects, and timetable',
        category: 'school',
        icon: 'BookOpen',
        isCore: false,
        sortOrder: 22,
      },
    }),
    prisma.module.upsert({
      where: { code: 'examinations' },
      update: {},
      create: {
        code: 'examinations',
        name: 'Examinations',
        description: 'Exam scheduling and results',
        category: 'school',
        icon: 'ClipboardCheck',
        isCore: false,
        dependencies: ['academics'],
        sortOrder: 23,
      },
    }),
    prisma.module.upsert({
      where: { code: 'fees' },
      update: {},
      create: {
        code: 'fees',
        name: 'Fee Management',
        description: 'Fee structure and collection',
        category: 'school',
        icon: 'Receipt',
        isCore: false,
        sortOrder: 24,
      },
    }),

    // Manufacturing modules
    prisma.module.upsert({
      where: { code: 'bom' },
      update: {},
      create: {
        code: 'bom',
        name: 'Bill of Materials',
        description: 'Product recipes and component lists',
        category: 'manufacturing',
        icon: 'FileSpreadsheet',
        isCore: false,
        dependencies: ['inventory'],
        sortOrder: 30,
      },
    }),
    prisma.module.upsert({
      where: { code: 'production' },
      update: {},
      create: {
        code: 'production',
        name: 'Production',
        description: 'Work orders and production tracking',
        category: 'manufacturing',
        icon: 'Activity',
        isCore: false,
        dependencies: ['bom', 'inventory'],
        sortOrder: 31,
      },
    }),
    prisma.module.upsert({
      where: { code: 'quality' },
      update: {},
      create: {
        code: 'quality',
        name: 'Quality Control',
        description: 'Quality inspection and testing',
        category: 'manufacturing',
        icon: 'CheckCircle',
        isCore: false,
        dependencies: ['production'],
        sortOrder: 32,
      },
    }),

    // Retail modules
    prisma.module.upsert({
      where: { code: 'pos' },
      update: {},
      create: {
        code: 'pos',
        name: 'Point of Sale',
        description: 'Retail billing and transactions',
        category: 'retail',
        icon: 'Monitor',
        isCore: false,
        dependencies: ['inventory'],
        sortOrder: 40,
      },
    }),
    prisma.module.upsert({
      where: { code: 'promotions' },
      update: {},
      create: {
        code: 'promotions',
        name: 'Promotions',
        description: 'Discounts and promotional campaigns',
        category: 'retail',
        icon: 'Percent',
        isCore: false,
        sortOrder: 41,
      },
    }),

    // Hospital modules
    prisma.module.upsert({
      where: { code: 'patients' },
      update: {},
      create: {
        code: 'patients',
        name: 'Patient Management',
        description: 'Patient registration and records',
        category: 'hospital',
        icon: 'Users',
        isCore: false,
        sortOrder: 50,
      },
    }),
    prisma.module.upsert({
      where: { code: 'doctors' },
      update: {},
      create: {
        code: 'doctors',
        name: 'Doctor Management',
        description: 'Doctor profiles and schedules',
        category: 'hospital',
        icon: 'Stethoscope',
        isCore: false,
        sortOrder: 51,
      },
    }),
    prisma.module.upsert({
      where: { code: 'appointments' },
      update: {},
      create: {
        code: 'appointments',
        name: 'Appointments',
        description: 'Appointment scheduling',
        category: 'hospital',
        icon: 'Calendar',
        isCore: false,
        dependencies: ['patients', 'doctors'],
        sortOrder: 52,
      },
    }),
    prisma.module.upsert({
      where: { code: 'pharmacy' },
      update: {},
      create: {
        code: 'pharmacy',
        name: 'Pharmacy',
        description: 'Medicine inventory and dispensing',
        category: 'hospital',
        icon: 'Pill',
        isCore: false,
        dependencies: ['inventory'],
        sortOrder: 53,
      },
    }),
  ]);
  console.log(`   ✓ Created ${modules.length} modules\n`);

  // Get module IDs for mapping
  const moduleMap = new Map(modules.map((m) => [m.code, m.id]));

  // Seed ERP Type Modules (default modules for each ERP)
  console.log('📦 Seeding ERP Type Module mappings...');

  // School ERP defaults
  const schoolErp = erpTypes.find((e) => e.code === 'school')!;
  await Promise.all([
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('organization')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('organization')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('users')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('users')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('students')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('students')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('teachers')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('teachers')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('academics')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('academics')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('examinations')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('examinations')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('fees')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('fees')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('finance')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('finance')!, isRequired: false, isDefault: false },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('hr')! } },
      update: {},
      create: { erpTypeId: schoolErp.id, moduleId: moduleMap.get('hr')!, isRequired: false, isDefault: false },
    }),
  ]);

  // Manufacturing ERP defaults
  const mfgErp = erpTypes.find((e) => e.code === 'manufacturing')!;
  await Promise.all([
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('organization')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('organization')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('users')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('users')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('inventory')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('inventory')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('bom')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('bom')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('production')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('production')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('quality')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('quality')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('procurement')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('procurement')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('sales')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('sales')!, isRequired: false, isDefault: false },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('finance')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('finance')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('hr')! } },
      update: {},
      create: { erpTypeId: mfgErp.id, moduleId: moduleMap.get('hr')!, isRequired: false, isDefault: false },
    }),
  ]);

  // Retail ERP defaults
  const retailErp = erpTypes.find((e) => e.code === 'retail')!;
  await Promise.all([
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('organization')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('organization')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('users')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('users')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('inventory')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('inventory')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('pos')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('pos')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('sales')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('sales')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('promotions')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('promotions')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('procurement')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('procurement')!, isRequired: false, isDefault: false },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: retailErp.id, moduleId: moduleMap.get('finance')! } },
      update: {},
      create: { erpTypeId: retailErp.id, moduleId: moduleMap.get('finance')!, isRequired: false, isDefault: true },
    }),
  ]);

  // Hospital ERP defaults
  const hospitalErp = erpTypes.find((e) => e.code === 'hospital')!;
  await Promise.all([
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('organization')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('organization')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('users')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('users')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('patients')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('patients')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('doctors')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('doctors')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('appointments')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('appointments')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('inventory')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('inventory')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('pharmacy')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('pharmacy')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('finance')! } },
      update: {},
      create: { erpTypeId: hospitalErp.id, moduleId: moduleMap.get('finance')!, isRequired: false, isDefault: true },
    }),
  ]);

  // General ERP defaults
  const generalErp = erpTypes.find((e) => e.code === 'general')!;
  await Promise.all([
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: generalErp.id, moduleId: moduleMap.get('organization')! } },
      update: {},
      create: { erpTypeId: generalErp.id, moduleId: moduleMap.get('organization')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: generalErp.id, moduleId: moduleMap.get('users')! } },
      update: {},
      create: { erpTypeId: generalErp.id, moduleId: moduleMap.get('users')!, isRequired: true, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: generalErp.id, moduleId: moduleMap.get('finance')! } },
      update: {},
      create: { erpTypeId: generalErp.id, moduleId: moduleMap.get('finance')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: generalErp.id, moduleId: moduleMap.get('inventory')! } },
      update: {},
      create: { erpTypeId: generalErp.id, moduleId: moduleMap.get('inventory')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: generalErp.id, moduleId: moduleMap.get('hr')! } },
      update: {},
      create: { erpTypeId: generalErp.id, moduleId: moduleMap.get('hr')!, isRequired: false, isDefault: true },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: generalErp.id, moduleId: moduleMap.get('procurement')! } },
      update: {},
      create: { erpTypeId: generalErp.id, moduleId: moduleMap.get('procurement')!, isRequired: false, isDefault: false },
    }),
    prisma.erpTypeModule.upsert({
      where: { erpTypeId_moduleId: { erpTypeId: generalErp.id, moduleId: moduleMap.get('sales')! } },
      update: {},
      create: { erpTypeId: generalErp.id, moduleId: moduleMap.get('sales')!, isRequired: false, isDefault: false },
    }),
  ]);
  console.log('   ✓ Created ERP Type Module mappings\n');

  // Seed Subscription Plans
  console.log('📦 Seeding Subscription Plans...');
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { code: 'starter' },
      update: {},
      create: {
        code: 'starter',
        name: 'Starter',
        description: 'Perfect for small businesses getting started',
        priceMonthly: 999,
        priceYearly: 9990,
        currency: 'INR',
        maxUsers: 3,
        maxBranches: 1,
        maxModules: 5,
        storageGB: 5,
        features: {
          support: 'email',
          reports: 'basic',
          api: false,
          customFields: false,
        },
        sortOrder: 1,
      },
    }),
    prisma.plan.upsert({
      where: { code: 'growth' },
      update: {},
      create: {
        code: 'growth',
        name: 'Growth',
        description: 'For growing businesses with more needs',
        priceMonthly: 2999,
        priceYearly: 29990,
        currency: 'INR',
        maxUsers: 15,
        maxBranches: 5,
        maxModules: 10,
        storageGB: 25,
        features: {
          support: 'priority',
          reports: 'advanced',
          api: true,
          customFields: true,
          workflows: true,
        },
        sortOrder: 2,
      },
    }),
    prisma.plan.upsert({
      where: { code: 'enterprise' },
      update: {},
      create: {
        code: 'enterprise',
        name: 'Enterprise',
        description: 'Full-featured solution for large organizations',
        priceMonthly: 9999,
        priceYearly: 99990,
        currency: 'INR',
        maxUsers: -1, // Unlimited
        maxBranches: -1,
        maxModules: -1,
        storageGB: 100,
        features: {
          support: 'dedicated',
          reports: 'custom',
          api: true,
          customFields: true,
          workflows: true,
          whiteLabel: true,
          sla: true,
        },
        sortOrder: 3,
      },
    }),
  ]);
  console.log(`   ✓ Created ${plans.length} subscription plans\n`);

  // Seed Permissions
  console.log('📦 Seeding Permissions...');
  const permissionData = [
    // Organization permissions
    { code: 'organization.view', name: 'View Organization', action: 'view', moduleCode: 'organization' },
    { code: 'organization.update', name: 'Update Organization', action: 'update', moduleCode: 'organization' },

    // User permissions
    { code: 'user.view', name: 'View Users', action: 'view', moduleCode: 'users' },
    { code: 'user.create', name: 'Create Users', action: 'create', moduleCode: 'users' },
    { code: 'user.update', name: 'Update Users', action: 'update', moduleCode: 'users' },
    { code: 'user.delete', name: 'Delete Users', action: 'delete', moduleCode: 'users' },

    // Role permissions
    { code: 'role.view', name: 'View Roles', action: 'view', moduleCode: 'users' },
    { code: 'role.create', name: 'Create Roles', action: 'create', moduleCode: 'users' },
    { code: 'role.update', name: 'Update Roles', action: 'update', moduleCode: 'users' },
    { code: 'role.delete', name: 'Delete Roles', action: 'delete', moduleCode: 'users' },

    // Branch permissions
    { code: 'branch.view', name: 'View Branches', action: 'view', moduleCode: 'organization' },
    { code: 'branch.create', name: 'Create Branches', action: 'create', moduleCode: 'organization' },
    { code: 'branch.update', name: 'Update Branches', action: 'update', moduleCode: 'organization' },
    { code: 'branch.delete', name: 'Delete Branches', action: 'delete', moduleCode: 'organization' },

    // Finance permissions
    { code: 'account.view', name: 'View Accounts', action: 'view', moduleCode: 'finance' },
    { code: 'account.create', name: 'Create Accounts', action: 'create', moduleCode: 'finance' },
    { code: 'invoice.view', name: 'View Invoices', action: 'view', moduleCode: 'finance' },
    { code: 'invoice.create', name: 'Create Invoices', action: 'create', moduleCode: 'finance' },
    { code: 'payment.view', name: 'View Payments', action: 'view', moduleCode: 'finance' },
    { code: 'payment.create', name: 'Create Payments', action: 'create', moduleCode: 'finance' },

    // Inventory permissions
    { code: 'product.view', name: 'View Products', action: 'view', moduleCode: 'inventory' },
    { code: 'product.create', name: 'Create Products', action: 'create', moduleCode: 'inventory' },
    { code: 'product.update', name: 'Update Products', action: 'update', moduleCode: 'inventory' },
    { code: 'warehouse.view', name: 'View Warehouses', action: 'view', moduleCode: 'inventory' },
    { code: 'stock.view', name: 'View Stock', action: 'view', moduleCode: 'inventory' },
    { code: 'stock.adjust', name: 'Adjust Stock', action: 'update', moduleCode: 'inventory' },

    // HR permissions
    { code: 'employee.view', name: 'View Employees', action: 'view', moduleCode: 'hr' },
    { code: 'employee.create', name: 'Create Employees', action: 'create', moduleCode: 'hr' },
    { code: 'attendance.view', name: 'View Attendance', action: 'view', moduleCode: 'hr' },
    { code: 'attendance.mark', name: 'Mark Attendance', action: 'create', moduleCode: 'hr' },

    // School permissions
    { code: 'student.view', name: 'View Students', action: 'view', moduleCode: 'students' },
    { code: 'student.create', name: 'Create Students', action: 'create', moduleCode: 'students' },
    { code: 'student.update', name: 'Update Students', action: 'update', moduleCode: 'students' },
    { code: 'teacher.view', name: 'View Teachers', action: 'view', moduleCode: 'teachers' },
    { code: 'teacher.create', name: 'Create Teachers', action: 'create', moduleCode: 'teachers' },
    { code: 'class.view', name: 'View Classes', action: 'view', moduleCode: 'academics' },
    { code: 'exam.view', name: 'View Exams', action: 'view', moduleCode: 'examinations' },
    { code: 'exam.create', name: 'Create Exams', action: 'create', moduleCode: 'examinations' },
    { code: 'fee.view', name: 'View Fees', action: 'view', moduleCode: 'fees' },
    { code: 'fee.create', name: 'Collect Fees', action: 'create', moduleCode: 'fees' },

    // Manufacturing permissions
    { code: 'bom.view', name: 'View BOMs', action: 'view', moduleCode: 'bom' },
    { code: 'bom.create', name: 'Create BOMs', action: 'create', moduleCode: 'bom' },
    { code: 'workorder.view', name: 'View Work Orders', action: 'view', moduleCode: 'production' },
    { code: 'workorder.create', name: 'Create Work Orders', action: 'create', moduleCode: 'production' },
    { code: 'production.view', name: 'View Production', action: 'view', moduleCode: 'production' },
    { code: 'quality.view', name: 'View Quality Checks', action: 'view', moduleCode: 'quality' },

    // Retail permissions
    { code: 'pos.view', name: 'Access POS', action: 'view', moduleCode: 'pos' },
    { code: 'pos.transact', name: 'Create Transactions', action: 'create', moduleCode: 'pos' },
    { code: 'promotion.view', name: 'View Promotions', action: 'view', moduleCode: 'promotions' },

    // Hospital permissions
    { code: 'patient.view', name: 'View Patients', action: 'view', moduleCode: 'patients' },
    { code: 'patient.create', name: 'Create Patients', action: 'create', moduleCode: 'patients' },
    { code: 'doctor.view', name: 'View Doctors', action: 'view', moduleCode: 'doctors' },
    { code: 'appointment.view', name: 'View Appointments', action: 'view', moduleCode: 'appointments' },
    { code: 'appointment.create', name: 'Create Appointments', action: 'create', moduleCode: 'appointments' },
    { code: 'pharmacy.view', name: 'View Pharmacy', action: 'view', moduleCode: 'pharmacy' },
  ];

  for (const perm of permissionData) {
    const moduleId = moduleMap.get(perm.moduleCode) || null;
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: {
        code: perm.code,
        name: perm.name,
        action: perm.action,
        moduleId,
      },
    });
  }
  console.log(`   ✓ Created ${permissionData.length} permissions\n`);

  console.log('✅ Database seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
