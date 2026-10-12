import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Factory,
  Store,
  Hospital,
  Building2,
  ArrowRight,
  Check,
  Package,
  Users,
  FileText,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

interface ErpType {
  code: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const erpTypes: ErpType[] = [
  {
    code: 'school',
    name: 'School ERP',
    description: 'Complete school management for K-12 and higher education',
    icon: <GraduationCap className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-600',
    features: ['Student Management', 'Teacher & Staff', 'Examinations', 'Fee Collection', 'Timetable', 'Transport'],
  },
  {
    code: 'manufacturing',
    name: 'Manufacturing ERP',
    description: 'Production planning, inventory, and quality control',
    icon: <Factory className="w-8 h-8" />,
    color: 'from-amber-500 to-orange-600',
    features: ['Bill of Materials', 'Work Orders', 'Production', 'Quality Control', 'Inventory', 'Procurement'],
  },
  {
    code: 'retail',
    name: 'Retail ERP',
    description: 'Point of sale, inventory, and customer management',
    icon: <Store className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-600',
    features: ['Point of Sale', 'Inventory', 'Customers', 'Promotions', 'Multi-Store', 'Reports'],
  },
  {
    code: 'hospital',
    name: 'Hospital ERP',
    description: 'Patient management, appointments, and medical records',
    icon: <Hospital className="w-8 h-8" />,
    color: 'from-red-500 to-pink-600',
    features: ['Patient Records', 'Appointments', 'Doctors', 'Pharmacy', 'Lab Reports', 'Billing'],
  },
  {
    code: 'general',
    name: 'General Business',
    description: 'Finance, HR, and inventory for any business',
    icon: <Building2 className="w-8 h-8" />,
    color: 'from-purple-500 to-violet-600',
    features: ['Finance', 'HR & Payroll', 'Inventory', 'Sales', 'Procurement', 'Reports'],
  },
];

const previewModules = {
  school: [
    { name: 'Students', icon: <Users className="w-5 h-5" /> },
    { name: 'Teachers', icon: <Users className="w-5 h-5" /> },
    { name: 'Classes', icon: <FileText className="w-5 h-5" /> },
    { name: 'Examinations', icon: <FileText className="w-5 h-5" /> },
    { name: 'Fee Management', icon: <Package className="w-5 h-5" /> },
  ],
  manufacturing: [
    { name: 'Inventory', icon: <Package className="w-5 h-5" /> },
    { name: 'Bill of Materials', icon: <FileText className="w-5 h-5" /> },
    { name: 'Work Orders', icon: <FileText className="w-5 h-5" /> },
    { name: 'Production', icon: <Settings className="w-5 h-5" /> },
    { name: 'Quality Control', icon: <Check className="w-5 h-5" /> },
  ],
  retail: [
    { name: 'Point of Sale', icon: <Store className="w-5 h-5" /> },
    { name: 'Inventory', icon: <Package className="w-5 h-5" /> },
    { name: 'Customers', icon: <Users className="w-5 h-5" /> },
    { name: 'Promotions', icon: <FileText className="w-5 h-5" /> },
    { name: 'Reports', icon: <FileText className="w-5 h-5" /> },
  ],
  hospital: [
    { name: 'Patients', icon: <Users className="w-5 h-5" /> },
    { name: 'Doctors', icon: <Users className="w-5 h-5" /> },
    { name: 'Appointments', icon: <FileText className="w-5 h-5" /> },
    { name: 'Pharmacy', icon: <Package className="w-5 h-5" /> },
    { name: 'Lab Reports', icon: <FileText className="w-5 h-5" /> },
  ],
  general: [
    { name: 'Finance', icon: <FileText className="w-5 h-5" /> },
    { name: 'HR & Payroll', icon: <Users className="w-5 h-5" /> },
    { name: 'Inventory', icon: <Package className="w-5 h-5" /> },
    { name: 'Sales', icon: <Store className="w-5 h-5" /> },
    { name: 'Reports', icon: <FileText className="w-5 h-5" /> },
  ],
};

export default function SelectErpPage() {
  const [selectedErp, setSelectedErp] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedErp) {
      navigate(`/register?erp=${selectedErp}`);
    }
  };

  const selectedErpData = erpTypes.find((e) => e.code === selectedErp);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choose Your ERP Solution
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the industry-specific ERP that best fits your business needs.
          Each solution comes with tailored modules and workflows.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ERP Type Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Your Industry
          </h2>
          {erpTypes.map((erp) => (
            <button
              key={erp.code}
              onClick={() => setSelectedErp(erp.code)}
              className={clsx(
                'w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4',
                selectedErp === erp.code
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
            >
              <div
                className={clsx(
                  'w-14 h-14 rounded-xl flex items-center justify-center text-white bg-gradient-to-br',
                  erp.color
                )}
              >
                {erp.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{erp.name}</h3>
                  {selectedErp === erp.code && (
                    <Check className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{erp.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {erp.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {erp.features.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      +{erp.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-6">
          {selectedErp ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={clsx(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br',
                    selectedErpData?.color
                  )}
                >
                  {selectedErpData?.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedErpData?.name}
                  </h3>
                  <p className="text-sm text-gray-500">Workspace Preview</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700">
                  Included Modules:
                </p>
                {previewModules[selectedErp as keyof typeof previewModules]?.map(
                  (module) => (
                    <div
                      key={module.name}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="text-primary-600">{module.icon}</div>
                      <span className="text-sm font-medium text-gray-700">
                        {module.name}
                      </span>
                    </div>
                  )
                )}
              </div>

              <button
                onClick={handleContinue}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue with {selectedErpData?.name}
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Select an ERP Type
              </h3>
              <p className="text-sm text-gray-500">
                Choose your industry from the left to see a preview of the
                modules and features available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Fully Configurable</h3>
          <p className="text-sm text-gray-500">
            Enable or disable modules based on your needs. Pay only for what you
            use.
          </p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Multi-Tenant</h3>
          <p className="text-sm text-gray-500">
            Your data is securely isolated. Manage multiple branches from a
            single dashboard.
          </p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Ready to Scale</h3>
          <p className="text-sm text-gray-500">
            Start with essentials, add modules as you grow. Enterprise-ready
            from day one.
          </p>
        </div>
      </div>
    </div>
  );
}
