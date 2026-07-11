import { Product } from '../../types';
import { apiClient, isMockMode } from '../../services/apiClient';

// --- MOCK DATA (Fallback & Cache) ---
let MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Premium Wireless Headphones', 
    description: 'Experience high-fidelity audio with our latest noise-cancellation technology.', 
    price: 299.99, 
    category: 'Electronics', 
    stock: 45, 
    image: 'https://picsum.photos/600/600?random=1',
    variants: [{ name: 'Color', options: ['Black', 'Silver', 'Navy'] }]
  },
  { 
    id: '2', 
    name: 'Ergonomic Office Chair', 
    description: 'Designed for all-day comfort, this chair features adjustable lumbar support.', 
    price: 189.50, 
    category: 'Furniture', 
    stock: 12, 
    image: 'https://picsum.photos/600/600?random=2',
    variants: [{ name: 'Color', options: ['Black', 'Grey'] }]
  },
  { 
    id: '3', 
    name: 'Smart Fitness Watch', 
    description: 'Track your health metrics with precision. Monitors heart rate, sleep quality, and SpO2.', 
    price: 99.00, 
    category: 'Electronics', 
    stock: 88, 
    image: 'https://picsum.photos/600/600?random=3',
    variants: [{ name: 'Band Size', options: ['S', 'M', 'L'] }]
  },
  { 
    id: '4', 
    name: 'Organic Green Tea', 
    description: 'Hand-picked premium loose leaf tea from sustainable gardens.', 
    price: 14.95, 
    category: 'Groceries', 
    stock: 200, 
    image: 'https://picsum.photos/600/600?random=4',
    variants: [{ name: 'Pack Size', options: ['100g', '250g'] }]
  },
  { 
    id: '5', 
    name: '4K Action Camera', 
    description: 'Capture life in stunning 4K detail. Features Hypersmooth stabilization.', 
    price: 349.99, 
    category: 'Cameras', 
    stock: 5, 
    image: 'https://picsum.photos/600/600?random=5' 
  },
];

// --- SERVICE METHODS ---

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    if (isMockMode()) throw new Error('Mock mode forced');
    const data = await apiClient.get<Product[]>('/products');
    console.log("Connected to Backend: Loaded products");
    return data;
  } catch (e) {
    console.warn('Backend unavailable or failed. Falling back to Mock Data.', e);
    // Simulate network latency for realism even in fallback
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PRODUCTS]), 600));
  }
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    if (isMockMode()) throw new Error('Mock mode forced');
    const data = await apiClient.get<Product>(`/products/${id}`);
    return data;
  } catch (e) {
    console.warn(`Backend unavailable for ID ${id}. Falling back to Mock Data.`, e);
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS.find(p => p.id === id)), 400));
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    if (isMockMode()) throw new Error('Mock mode forced');
    return await apiClient.post<Product>('/products', product);
  } catch (e) {
    console.warn('Backend unavailable. Creating product in local mock state.', e);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
        MOCK_PRODUCTS.push(newProduct);
        resolve(newProduct);
      }, 500);
    });
  }
};

export const updateProduct = async (product: Product): Promise<Product> => {
  // Backend PUT not implemented in demo controller yet, relying on local simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_PRODUCTS = MOCK_PRODUCTS.map(p => p.id === product.id ? product : p);
      resolve(product);
    }, 500);
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    if (isMockMode()) throw new Error('Mock mode forced');
    await apiClient.delete(`/products/${id}`);
  } catch (e) {
    console.warn('Backend unavailable. Deleting product from local mock state.', e);
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
        resolve();
      }, 500);
    });
  }
};