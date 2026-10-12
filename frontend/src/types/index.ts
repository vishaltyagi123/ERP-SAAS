export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isPlatformAdmin: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  email: string;
  logo?: string;
  isOnboarded: boolean;
  erpType?: ErpType;
}

export interface ErpType {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Module {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  icon?: string;
  isRequired?: boolean;
  isDefault?: boolean;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxUsers: number;
  maxBranches: number;
  maxModules: number;
  storageGB: number;
  features: Record<string, unknown>;
}

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  icon?: string;
  path?: string;
  permission?: string;
  children?: MenuItem[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
  organization: Organization | null;
}

export interface RegisterResponse extends AuthTokens {
  user: User;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}
