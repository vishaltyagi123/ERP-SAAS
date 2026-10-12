import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  maxUsers: number;
  maxBranches: number;
  maxModules: number;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: '1',
    code: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses getting started',
    priceMonthly: 999,
    priceYearly: 9990,
    maxUsers: 3,
    maxBranches: 1,
    maxModules: 5,
    features: [
      'Up to 3 users',
      '1 branch',
      '5 modules',
      '5 GB storage',
      'Email support',
      'Basic reports',
    ],
  },
  {
    id: '2',
    code: 'growth',
    name: 'Growth',
    description: 'For growing businesses with more needs',
    priceMonthly: 2999,
    priceYearly: 29990,
    maxUsers: 15,
    maxBranches: 5,
    maxModules: 10,
    popular: true,
    features: [
      'Up to 15 users',
      '5 branches',
      '10 modules',
      '25 GB storage',
      'Priority support',
      'Advanced reports',
      'API access',
      'Custom fields',
      'Workflow automation',
    ],
  },
  {
    id: '3',
    code: 'enterprise',
    name: 'Enterprise',
    description: 'Full-featured solution for large organizations',
    priceMonthly: 9999,
    priceYearly: 99990,
    maxUsers: -1,
    maxBranches: -1,
    maxModules: -1,
    features: [
      'Unlimited users',
      'Unlimited branches',
      'All modules',
      '100 GB storage',
      'Dedicated support',
      'Custom reports',
      'Full API access',
      'Custom fields',
      'Workflow automation',
      'White labeling',
      'SLA guarantee',
    ],
  },
];

export default function SelectPlanPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleContinue = () => {
    // In production, handle subscription creation
    navigate('/dashboard');
  };

  const formatPrice = (plan: Plan) => {
    const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
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
            <span className="w-16 h-0.5 bg-primary-600" />
            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-600">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span
            className={clsx(
              'text-sm font-medium',
              billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')
            }
            className={clsx(
              'relative w-14 h-7 rounded-full transition-colors',
              billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-300'
            )}
          >
            <span
              className={clsx(
                'absolute top-1 w-5 h-5 bg-white rounded-full transition-transform',
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              )}
            />
          </button>
          <span
            className={clsx(
              'text-sm font-medium',
              billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            Yearly
            <span className="ml-1 text-green-600 text-xs">(Save 17%)</span>
          </span>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.code)}
              className={clsx(
                'relative rounded-2xl border-2 p-6 cursor-pointer transition-all',
                selectedPlan === plan.code
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(plan)}
                </span>
                <span className="text-gray-500">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={clsx(
                  'w-full py-2 rounded-lg font-medium transition-colors',
                  selectedPlan === plan.code
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {selectedPlan === plan.code ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2 mx-auto"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
