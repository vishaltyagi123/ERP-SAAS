import api from './api';
import type { ErpType, Module, Plan, MenuItem } from '@/types';

export const erpService = {
  async getErpTypes(): Promise<ErpType[]> {
    const response = await api.get<ErpType[]>('/erp-types');
    return response.data;
  },

  async getErpTypeByCode(code: string): Promise<ErpType> {
    const response = await api.get<ErpType>(`/erp-types/${code}`);
    return response.data;
  },

  async getModulesForErpType(erpTypeId: string): Promise<Module[]> {
    const response = await api.get<Module[]>(`/erp-types/${erpTypeId}/modules`);
    return response.data;
  },

  async getAllModules(): Promise<Module[]> {
    const response = await api.get<Module[]>('/modules');
    return response.data;
  },

  async getPlans(): Promise<Plan[]> {
    const response = await api.get<Plan[]>('/subscriptions/plans');
    return response.data;
  },

  async getMenuForErpType(erpTypeCode: string): Promise<MenuItem[]> {
    const response = await api.get<MenuItem[]>(`/menu/erp-type/${erpTypeCode}`);
    return response.data;
  },

  async getUserMenu(): Promise<MenuItem[]> {
    const response = await api.get<MenuItem[]>('/menu');
    return response.data;
  },
};
