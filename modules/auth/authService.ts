import { User } from '../../types';
import { apiClient } from '../../services/apiClient';

interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async () => {
  // In a stateless JWT setup, the client just removes the token.
  // No server call is strictly necessary unless you have a token blacklist.
  return Promise.resolve();
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    console.error('Forgot password failed:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', { token, password });
    return response;
  } catch (error) {
    console.error('Reset password failed:', error);
    throw error;
  }
};
