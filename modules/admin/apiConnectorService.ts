import { apiClient } from '../../services/apiClient';
import { ExternalAPIConfig } from '../../types';

export const fetchApiConfigs = async (): Promise<ExternalAPIConfig[]> => {
  return await apiClient.get<ExternalAPIConfig[]>('/admin/apiconfigs');
};

export const saveApiConfig = async (config: Partial<ExternalAPIConfig>): Promise<ExternalAPIConfig> => {
  return await apiClient.post<ExternalAPIConfig>('/admin/apiconfigs', config);
};

export const deleteApiConfig = async (id: number): Promise<void> => {
  return await apiClient.delete(`/admin/apiconfigs/${id}`);
};

export const toggleApiConfig = async (id: number): Promise<ExternalAPIConfig> => {
  return await apiClient.post<ExternalAPIConfig>(`/admin/apiconfigs/${id}/toggle`, {});
};
