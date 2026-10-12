import {
  Package,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

const stats: StatCard[] = [
  {
    title: 'Total Revenue',
    value: '₹12,45,000',
    change: '+12.5%',
    changeType: 'positive',
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    changeType: 'positive',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    title: 'Products',
    value: '456',
    change: '+2.4%',
    changeType: 'positive',
    icon: <Package className="w-6 h-6" />,
  },
  {
    title: 'Customers',
    value: '789',
    change: '-1.2%',
    changeType: 'negative',
    icon: <Users className="w-6 h-6" />,
  },
];

const recentActivity = [
  { id: 1, action: 'New order received', detail: 'Order #1234 - ₹15,000', time: '5 min ago' },
  { id: 2, action: 'Stock updated', detail: 'Product SKU-001 - 50 units added', time: '15 min ago' },
  { id: 3, action: 'Invoice generated', detail: 'Invoice INV-2024-001', time: '1 hour ago' },
  { id: 4, action: 'New customer added', detail: 'Acme Corp', time: '2 hours ago' },
  { id: 5, action: 'Payment received', detail: 'Payment #PAY-123 - ₹25,000', time: '3 hours ago' },
];

export default function DashboardPage() {
  const { user, organization } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-primary-100 mt-1">
          Here's what's happening with {organization?.name} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.detail}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full p-3 rounded-lg bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 transition-colors text-left">
              + Create New Order
            </button>
            <button className="w-full p-3 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-colors text-left">
              + Add Product
            </button>
            <button className="w-full p-3 rounded-lg bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors text-left">
              + Generate Invoice
            </button>
            <button className="w-full p-3 rounded-lg bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition-colors text-left">
              + Add Customer
            </button>
          </div>

          {/* Subscription Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Subscription
              </span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-500">Growth Plan · Monthly</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Users: 5/15</span>
                <span>33%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: '33%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
