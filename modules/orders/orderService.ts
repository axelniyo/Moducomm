import { Order } from '../../types';
import { apiClient } from '../../services/apiClient';

export const placeOrder = async (): Promise<Order> => {
  try {
    const order = await apiClient.post<Order>('/orders', {});
    return order;
  } catch (error) {
    console.error('Failed to place order:', error);
    throw error;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const orders = await apiClient.get<Order[]>('/orders');
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
    try {
      const orders = await apiClient.get<Order[]>('/orders/all');
      return orders;
    } catch (error) {
      console.error('Failed to fetch all orders:', error);
      throw error;
    }
  };
