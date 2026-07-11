export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  variants?: ProductVariant[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
    id: number;
    user: User;
    items: CartItem[];
}

export interface ExternalAPIConfig {
  id: number;
  name: string;
  url: string;
  active: boolean;
  idField: string;
  nameField: string;
  descriptionField: string;
  priceField: string;
  categoryField: string;
  imageField: string;
  stockField: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED' | 'DELIVERED';

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
  id: number;
  user: User;
  orderDate: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}
