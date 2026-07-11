import { Cart, CartItem } from '../../types';
import { apiClient } from '../../services/apiClient';

export const getCart = async (): Promise<Cart> => {
  try {
    const cart = await apiClient.get<Cart>('/cart');
    return cart;
  } catch (error) {
    console.error('Failed to get cart:', error);
    throw error;
  }
};

export const addItemToCart = async (productId: string, quantity: number): Promise<Cart> => {
  try {
    const cart = await apiClient.post<Cart>('/cart/items', { productId, quantity });
    return cart;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
};

export const removeItemFromCart = async (itemId: number): Promise<Cart> => {
  try {
    const cart = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
    return cart;
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    throw error;
  }
};
