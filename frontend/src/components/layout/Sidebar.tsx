import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { clsx } from 'clsx';

interface MenuItem {
  id: string;
  code: string;
  name: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
}

// Demo menu items - in production, fetch from API based on ERP type
const demoMenu: MenuItem[] = [
  { id: '1', code: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  {
    id: '2', code: 'inventory', name: 'Inventory', icon: 'Package',
    children: [
      { id: '2-1', code: 'products', name: 'Products', icon: 'Box', path: '/inventory/products' },
      { id: '2-2', code: 'warehouses', name: 'Warehouses', icon: 'Warehouse', path: '/inventory/warehouses' },
      { id: '2-3', code: 'stock', name: 'Stock', icon: 'PackageSearch', path: '/inventory/stock' },
    ],
  },
  {
    id: '3', code: 'sales', name: 'Sales', icon: 'TrendingUp',
    children: [
      { id: '3-1', code: 'customers', name: 'Customers', icon: 'Users', path: '/sales/customers' },
      { id: '3-2', code: 'orders', name: 'Sales Orders', icon: 'ShoppingCart', path: '/sales/orders' },
      { id: '3-3', code: 'invoices', name: 'Invoices', icon: 'FileText', path: '/sales/invoices' },
    ],
  },
  {
    id: '4', code: 'finance', name: 'Finance', icon: 'IndianRupee',
    children: [
      { id: '4-1', code: 'accounts', name: 'Accounts', icon: 'List', path: '/finance/accounts' },
      { id: '4-2', code: 'payments', name: 'Payments', icon: 'CreditCard', path: '/finance/payments' },
    ],
  },
  {
    id: '5', code: 'settings', name: 'Settings', icon: 'Settings',
    children: [
      { id: '5-1', code: 'organization', name: 'Organization', icon: 'Building', path: '/settings/organization' },
      { id: '5-2', code: 'users', name: 'Users', icon: 'Users', path: '/settings/users' },
      { id: '5-3', code: 'roles', name: 'Roles', icon: 'Shield', path: '/settings/roles' },
    ],
  },
];

function getIconComponent(iconName?: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return Icons.Circle;
  // @ts-expect-error - Dynamic icon lookup
  return Icons[iconName] || Icons.Circle;
}

function MenuItemComponent({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === location.pathname;
  const IconComponent = getIconComponent(item.icon);

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const content = (
    <>
      <span className="flex items-center gap-3 flex-1">
        <IconComponent className="w-5 h-5" />
        <span>{item.name}</span>
      </span>
      {hasChildren && (
        <span className="ml-auto">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
      )}
    </>
  );

  const className = clsx(
    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full',
    {
      'bg-primary-50 text-primary-700': isActive,
      'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive,
      'pl-10': level > 0,
    }
  );

  return (
    <div>
      {item.path && !hasChildren ? (
        <Link to={item.path} className={className}>
          {content}
        </Link>
      ) : (
        <button onClick={handleClick} className={className}>
          {content}
        </button>
      )}

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <MenuItemComponent key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-20">
      <nav className="p-4 space-y-1">
        {demoMenu.map((item) => (
          <MenuItemComponent key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );
}
