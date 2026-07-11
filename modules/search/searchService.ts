import { Product } from '../../types';
import { apiClient } from '../../services/apiClient';

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const data = await apiClient.get<Product[]>(`/products/search?name=${query}`);
    return data;
  } catch (e) {
    console.error("Search failed", e);
    return [];
  }
};
