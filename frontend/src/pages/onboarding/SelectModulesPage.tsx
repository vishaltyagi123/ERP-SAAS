import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Lock, Package } from 'lucide-react';
import { clsx } from 'clsx';

interface Module {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  isRequired: boolean;
  isDefault: boolean;
  category: string;
}

// Demo modules - in production, fetch from API
const demoModules: Module[] = [
  { id: '1', code: 'organization', name: 'Organization', description: 'Company settings and branches', icon: 'Building', isRequired: true, isDefault: true, category: 'platform' },
  { id: '2', code: 'users', name: 'User Management', description: 'Users, roles, and permissions', icon: 'Users', isRequired: true, isDefault: true, category: 'platform' },
  { id: '3', code: 'inventory', name: 'Inventory', description: 'Products, stock, and warehouses', icon: 'Package', isRequired: false, isDefault: true, category: 'core' },
  { id: '4', code: 'finance', name: 'Finance', description: 'Accounts, invoices, and payments', icon: 'IndianRupee', isRequired: false, isDefault: true, category: 'core' },
  { id: '5', code: 'hr', name: 'HR & Payroll', description: 'Employees, attendance, and payroll', icon: 'UserCheck', isRequired: false, isDefault: false, category: 'core' },
  { id: '6', code: 'procurement', name: 'Procurement', description: 'Vendors and purchase orders', icon: 'ShoppingCart', isRequired: false, isDefault: false, category: 'core' },
  { id: '7', code: 'sales', name: 'Sales', description: 'Customers and sales orders', icon: 'TrendingUp', isRequired: false, isDefault: true, category: 'core' },
  { id: '8', code: 'bom', name: 'Bill of Materials', description: 'Product recipes and components', icon: 'FileSpreadsheet', isRequired: false, isDefault: true, category: 'manufacturing' },
  { id: '9', code: 'production', name: 'Production', description: 'Work orders and tracking', icon: 'Activity', isRequired: false, isDefault: true, category: 'manufacturing' },
  { id: '10', code: 'quality', name: 'Quality Control', description: 'Quality checks and testing', icon: 'CheckCircle', isRequired: false, isDefault: false, category: 'manufacturing' },
];

export default function SelectModulesPage() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState<Set<string>>(
    new Set(demoModules.filter((m) => m.isDefault || m.isRequired).map((m) => m.id))
  );

  const toggleModule = (module: Module) => {
    if (module.isRequired) return;

    const newSelected = new Set(selectedModules);
    if (newSelected.has(module.id)) {
      newSelected.delete(module.id);
    } else {
      newSelected.add(module.id);
    }
    setSelectedModules(newSelected);
  };

  const handleContinue = () => {
    navigate('/onboarding/plan');
  };

  const groupedModules = demoModules.reduce(
    (acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = [];
      }
      acc[module.category].push(module);
      return acc;
    },
    {} as Record<string, Module[]>
  );

  const categoryLabels: Record<string, string> = {
    platform: 'Platform (Required)',
    core: 'Core Modules',
    manufacturing: 'Manufacturing',
    school: 'School',
    retail: 'Retail',
    hospital: 'Hospital',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              1
            </span>
            <span className="w-16 h-0.5 bg-primary-600" />
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              2
            </span>
            <span className="w-16 h-0.5 bg-gray-300" />
            <span className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Select Your Modules
          </h1>
          <p className="text-gray-600">
            Choose the modules you need. You can always add or remove modules later.
          </p>
        </div>

        {/* Module Selection */}
        <div className="space-y-8">
          {Object.entries(groupedModules).map(([category, modules]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {categoryLabels[category] || category}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => toggleModule(module)}
                    disabled={module.isRequired}
                    className={clsx(
                      'p-4 rounded-xl border-2 transition-all text-left',
                      selectedModules.has(module.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300',
                      module.isRequired && 'cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={clsx(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            selectedModules.has(module.id)
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-gray-100 text-gray-600'
                          )}
                        >
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {module.name}
                            </h3>
                            {module.isRequired && (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className={clsx(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                          selectedModules.has(module.id)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        )}
                      >
                        {selectedModules.has(module.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {selectedModules.size} modules selected
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="btn btn-primary flex items-center gap-2"
            >
              Continue to Plans
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Spacer for fixed footer */}
        <div className="h-24" />
      </div>
    </div>
  );
}
