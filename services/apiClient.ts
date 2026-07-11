import { Product } from '../types';

// Uses VITE_API_URL in production (points to Render backend),
// falls back to '/api' in development (Vite proxy forwards to localhost:8080)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Function to get the JWT token from storage
const getToken = () => {
  try {
    const storedAuth = localStorage.getItem('moducomm_auth');
    if (storedAuth) {
      const { token } = JSON.parse(storedAuth);
      return token;
    }
  } catch (e) {
    console.error("Failed to parse token from storage", e);
  }
  return null;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(fullUrl, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return response.json();
    } catch (error) {
      console.warn(`API Connection Failed to ${fullUrl} (Backend likely offline):`, error);
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return response.json();
    } catch (error) {
      console.warn(`API Connection Failed to ${fullUrl}:`, error);
      throw error;
    }
  },
  
  delete: async (endpoint: string): Promise<void> => {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    } catch (error) {
      console.warn(`API Connection Failed to ${fullUrl}:`, error);
      throw error;
    }
  }
};
