import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Onboarding Pages
import SelectErpPage from '@/pages/onboarding/SelectErpPage';
import SelectModulesPage from '@/pages/onboarding/SelectModulesPage';
import SelectPlanPage from '@/pages/onboarding/SelectPlanPage';

// Dashboard
import DashboardPage from '@/pages/dashboard/DashboardPage';

// Layouts
import AuthLayout from '@/components/layout/AuthLayout';
import MainLayout from '@/components/layout/MainLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Onboarding Routes (Public - for ERP selection preview) */}
      <Route
        path="/select-erp"
        element={
          <AuthLayout>
            <SelectErpPage />
          </AuthLayout>
        }
      />

      {/* Protected Onboarding */}
      <Route
        path="/onboarding/modules"
        element={
          <ProtectedRoute>
            <SelectModulesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/plan"
        element={
          <ProtectedRoute>
            <SelectPlanPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/select-erp" replace />} />
      <Route path="*" element={<Navigate to="/select-erp" replace />} />
    </Routes>
  );
}

export default App;
