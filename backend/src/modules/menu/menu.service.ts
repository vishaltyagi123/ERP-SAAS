import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  icon: string | null;
  path: string | null;
  permission: string | null;
  children?: MenuItem[];
}

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  /**
   * Build dynamic menu for a user based on:
   * 1. Organization's ERP type
   * 2. Enabled modules
   * 3. User's permissions
   */
  async buildMenuForUser(userId: string, organizationId: string): Promise<MenuItem[]> {
    // Get organization with ERP type
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        erpType: true,
      },
    });

    if (!organization) {
      return [];
    }

    // Get enabled modules for organization
    const enabledModules = await this.prisma.organizationModule.findMany({
      where: {
        organizationId,
        isEnabled: true,
      },
      select: { moduleId: true, module: { select: { code: true } } },
    });

    const enabledModuleCodes = enabledModules.map((m) => m.module.code);

    // Get user's permissions
    const userPermissions = await this.getUserPermissions(userId);

    // Get menu items for this ERP type and enabled modules
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        isActive: true,
        OR: [
          { erpTypeId: organization.erpTypeId },
          { erpTypeId: null }, // Generic menu items
        ],
        OR: [
          { moduleId: null }, // Platform menus
          {
            module: {
              code: { in: enabledModuleCodes },
            },
          },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Filter by permissions and build hierarchy
    const filteredItems = menuItems.filter((item) => {
      if (!item.permission) return true;
      return userPermissions.includes(item.permission);
    });

    // Build menu tree
    return this.buildMenuTree(filteredItems);
  }

  /**
   * Get all menu items for an ERP type (for admin configuration)
   */
  async getMenuItemsByErpType(erpTypeId: string): Promise<MenuItem[]> {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        OR: [
          { erpTypeId },
          { erpTypeId: null },
        ],
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    return this.buildMenuTree(menuItems);
  }

  /**
   * Get static menu structure based on ERP type
   */
  async getStaticMenuForErpType(erpTypeCode: string): Promise<MenuItem[]> {
    const menus = this.getDefaultMenusByErpType(erpTypeCode);
    return menus;
  }

  private async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissions = new Set<string>();
    userRoles.forEach((userRole) => {
      userRole.role.rolePermissions.forEach((rp) => {
        permissions.add(rp.permission.code);
      });
    });

    return Array.from(permissions);
  }

  private buildMenuTree(items: any[]): MenuItem[] {
    const itemMap = new Map<string, MenuItem & { children: MenuItem[] }>();
    const roots: MenuItem[] = [];

    // First pass: create all items
    items.forEach((item) => {
      itemMap.set(item.id, {
        id: item.id,
        code: item.code,
        name: item.name,
        icon: item.icon,
        path: item.path,
        permission: item.permission,
        children: [],
      });
    });

    // Second pass: build hierarchy
    items.forEach((item) => {
      const menuItem = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        itemMap.get(item.parentId)!.children.push(menuItem);
      } else {
        roots.push(menuItem);
      }
    });

    // Remove empty children arrays
    const cleanChildren = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.children && item.children.length === 0) {
          const { children, ...rest } = item;
          return rest;
        }
        return {
          ...item,
          children: cleanChildren(item.children || []),
        };
      });
    };

    return cleanChildren(roots);
  }

  /**
   * Default menu structure by ERP type
   */
  private getDefaultMenusByErpType(erpTypeCode: string): MenuItem[] {
    const commonMenus: MenuItem[] = [
      { id: '1', code: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', permission: null },
      {
        id: '2', code: 'settings', name: 'Settings', icon: 'Settings', path: null, permission: null,
        children: [
          { id: '2-1', code: 'organization', name: 'Organization', icon: 'Building', path: '/settings/organization', permission: 'organization.view' },
          { id: '2-2', code: 'users', name: 'Users', icon: 'Users', path: '/settings/users', permission: 'user.view' },
          { id: '2-3', code: 'roles', name: 'Roles', icon: 'Shield', path: '/settings/roles', permission: 'role.view' },
          { id: '2-4', code: 'branches', name: 'Branches', icon: 'GitBranch', path: '/settings/branches', permission: 'branch.view' },
        ],
      },
    ];

    const erpSpecificMenus: Record<string, MenuItem[]> = {
      school: [
        {
          id: 's1', code: 'academics', name: 'Academics', icon: 'GraduationCap', path: null, permission: null,
          children: [
            { id: 's1-1', code: 'students', name: 'Students', icon: 'Users', path: '/school/students', permission: 'student.view' },
            { id: 's1-2', code: 'teachers', name: 'Teachers', icon: 'UserCheck', path: '/school/teachers', permission: 'teacher.view' },
            { id: 's1-3', code: 'classes', name: 'Classes', icon: 'School', path: '/school/classes', permission: 'class.view' },
            { id: 's1-4', code: 'subjects', name: 'Subjects', icon: 'BookOpen', path: '/school/subjects', permission: 'subject.view' },
          ],
        },
        {
          id: 's2', code: 'examinations', name: 'Examinations', icon: 'ClipboardCheck', path: null, permission: null,
          children: [
            { id: 's2-1', code: 'exams', name: 'Exams', icon: 'FileText', path: '/school/exams', permission: 'exam.view' },
            { id: 's2-2', code: 'results', name: 'Results', icon: 'Award', path: '/school/results', permission: 'result.view' },
          ],
        },
        {
          id: 's3', code: 'fees', name: 'Fee Management', icon: 'IndianRupee', path: null, permission: null,
          children: [
            { id: 's3-1', code: 'fee-structure', name: 'Fee Structure', icon: 'List', path: '/school/fee-structure', permission: 'fee.view' },
            { id: 's3-2', code: 'fee-collection', name: 'Fee Collection', icon: 'Receipt', path: '/school/fee-collection', permission: 'fee.create' },
          ],
        },
      ],
      manufacturing: [
        {
          id: 'm1', code: 'inventory', name: 'Inventory', icon: 'Package', path: null, permission: null,
          children: [
            { id: 'm1-1', code: 'products', name: 'Products', icon: 'Box', path: '/inventory/products', permission: 'product.view' },
            { id: 'm1-2', code: 'warehouses', name: 'Warehouses', icon: 'Warehouse', path: '/inventory/warehouses', permission: 'warehouse.view' },
            { id: 'm1-3', code: 'stock', name: 'Stock', icon: 'PackageSearch', path: '/inventory/stock', permission: 'stock.view' },
          ],
        },
        {
          id: 'm2', code: 'production', name: 'Production', icon: 'Factory', path: null, permission: null,
          children: [
            { id: 'm2-1', code: 'bom', name: 'Bill of Materials', icon: 'FileSpreadsheet', path: '/manufacturing/bom', permission: 'bom.view' },
            { id: 'm2-2', code: 'work-orders', name: 'Work Orders', icon: 'ClipboardList', path: '/manufacturing/work-orders', permission: 'workorder.view' },
            { id: 'm2-3', code: 'production-entry', name: 'Production Entry', icon: 'Activity', path: '/manufacturing/production', permission: 'production.view' },
            { id: 'm2-4', code: 'quality', name: 'Quality Control', icon: 'CheckCircle', path: '/manufacturing/quality', permission: 'quality.view' },
          ],
        },
        {
          id: 'm3', code: 'procurement', name: 'Procurement', icon: 'ShoppingCart', path: null, permission: null,
          children: [
            { id: 'm3-1', code: 'vendors', name: 'Vendors', icon: 'Truck', path: '/procurement/vendors', permission: 'vendor.view' },
            { id: 'm3-2', code: 'purchase-orders', name: 'Purchase Orders', icon: 'FileText', path: '/procurement/purchase-orders', permission: 'purchaseorder.view' },
          ],
        },
      ],
      retail: [
        {
          id: 'r1', code: 'pos', name: 'Point of Sale', icon: 'Monitor', path: '/retail/pos', permission: 'pos.view',
        },
        {
          id: 'r2', code: 'inventory', name: 'Inventory', icon: 'Package', path: null, permission: null,
          children: [
            { id: 'r2-1', code: 'products', name: 'Products', icon: 'Box', path: '/inventory/products', permission: 'product.view' },
            { id: 'r2-2', code: 'stock', name: 'Stock', icon: 'PackageSearch', path: '/inventory/stock', permission: 'stock.view' },
          ],
        },
        {
          id: 'r3', code: 'sales', name: 'Sales', icon: 'TrendingUp', path: null, permission: null,
          children: [
            { id: 'r3-1', code: 'customers', name: 'Customers', icon: 'Users', path: '/sales/customers', permission: 'customer.view' },
            { id: 'r3-2', code: 'promotions', name: 'Promotions', icon: 'Percent', path: '/retail/promotions', permission: 'promotion.view' },
          ],
        },
      ],
      hospital: [
        {
          id: 'h1', code: 'reception', name: 'Reception', icon: 'UserPlus', path: null, permission: null,
          children: [
            { id: 'h1-1', code: 'patients', name: 'Patients', icon: 'Users', path: '/hospital/patients', permission: 'patient.view' },
            { id: 'h1-2', code: 'appointments', name: 'Appointments', icon: 'Calendar', path: '/hospital/appointments', permission: 'appointment.view' },
          ],
        },
        {
          id: 'h2', code: 'medical', name: 'Medical', icon: 'Stethoscope', path: null, permission: null,
          children: [
            { id: 'h2-1', code: 'doctors', name: 'Doctors', icon: 'UserCheck', path: '/hospital/doctors', permission: 'doctor.view' },
            { id: 'h2-2', code: 'opd', name: 'OPD', icon: 'Building', path: '/hospital/opd', permission: 'opd.view' },
          ],
        },
        {
          id: 'h3', code: 'pharmacy', name: 'Pharmacy', icon: 'Pill', path: '/hospital/pharmacy', permission: 'pharmacy.view',
        },
      ],
      general: [
        {
          id: 'g1', code: 'finance', name: 'Finance', icon: 'IndianRupee', path: null, permission: null,
          children: [
            { id: 'g1-1', code: 'accounts', name: 'Chart of Accounts', icon: 'List', path: '/finance/accounts', permission: 'account.view' },
            { id: 'g1-2', code: 'invoices', name: 'Invoices', icon: 'FileText', path: '/finance/invoices', permission: 'invoice.view' },
            { id: 'g1-3', code: 'payments', name: 'Payments', icon: 'CreditCard', path: '/finance/payments', permission: 'payment.view' },
          ],
        },
        {
          id: 'g2', code: 'inventory', name: 'Inventory', icon: 'Package', path: null, permission: null,
          children: [
            { id: 'g2-1', code: 'products', name: 'Products', icon: 'Box', path: '/inventory/products', permission: 'product.view' },
            { id: 'g2-2', code: 'stock', name: 'Stock', icon: 'PackageSearch', path: '/inventory/stock', permission: 'stock.view' },
          ],
        },
        {
          id: 'g3', code: 'hr', name: 'HR', icon: 'Users', path: null, permission: null,
          children: [
            { id: 'g3-1', code: 'employees', name: 'Employees', icon: 'UserCheck', path: '/hr/employees', permission: 'employee.view' },
            { id: 'g3-2', code: 'attendance', name: 'Attendance', icon: 'Clock', path: '/hr/attendance', permission: 'attendance.view' },
          ],
        },
      ],
    };

    const specificMenus = erpSpecificMenus[erpTypeCode] || erpSpecificMenus.general;
    return [...commonMenus.slice(0, 1), ...specificMenus, ...commonMenus.slice(1)];
  }
}
