import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    ),
  organizationName: z.string().min(2, 'Organization name is required'),
  erpTypeCode: z.string().min(1, 'Please select an ERP type'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const erpTypes = [
  { code: 'school', name: 'School ERP', icon: '🏫' },
  { code: 'manufacturing', name: 'Manufacturing ERP', icon: '🏭' },
  { code: 'retail', name: 'Retail ERP', icon: '🛒' },
  { code: 'hospital', name: 'Hospital ERP', icon: '🏥' },
  { code: 'general', name: 'General Business', icon: '🏢' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      erpTypeCode: searchParams.get('erp') || '',
    },
  });

  const selectedErp = watch('erpTypeCode');

  useEffect(() => {
    const erp = searchParams.get('erp');
    if (erp) {
      setValue('erpTypeCode', erp);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      login(
        response.user,
        { id: response.organization.id, name: response.organization.name, slug: response.organization.slug, email: data.email, isOnboarded: false },
        response.accessToken,
        response.refreshToken
      );
      toast.success('Account created successfully!');
      navigate('/onboarding/modules');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="card">
        <Link
          to="/select-erp"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ERP Selection
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-2">Start your free trial today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ERP Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select ERP Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {erpTypes.map((erp) => (
                <button
                  key={erp.code}
                  type="button"
                  onClick={() => setValue('erpTypeCode', erp.code)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedErp === erp.code
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{erp.icon}</span>
                  <div className="text-xs font-medium mt-1">{erp.name}</div>
                </button>
              ))}
            </div>
            {errors.erpTypeCode && (
              <p className="text-sm text-red-500 mt-1">{errors.erpTypeCode.message}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                {...register('firstName')}
                className="input"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                {...register('lastName')}
                className="input"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              {...register('organizationName')}
              className="input"
              placeholder="Acme Corporation"
            />
            {errors.organizationName && (
              <p className="text-sm text-red-500 mt-1">{errors.organizationName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="input"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
