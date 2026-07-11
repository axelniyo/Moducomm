import { apiClient } from '../../services/apiClient';

export interface DashboardStats {
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
}

export interface RevenueDataPoint {
    date: string;
    sales: number;
}

export interface ActivityLog {
    type: 'order' | 'user' | 'system' | 'alert';
    text: string;
    timestamp: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const stats = await apiClient.get<DashboardStats>('/admin/stats');
    return stats;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      totalRevenue: 0,
      totalProducts: 0,
      totalUsers: 0,
      pendingOrders: 0,
    };
  }
};

export const fetchRevenueOverview = async (): Promise<RevenueDataPoint[]> => {
    try {
        const revenueData = await apiClient.get<RevenueDataPoint[]>('/admin/revenue-overview');
        return revenueData;
    } catch (error) {
        console.error('Failed to fetch revenue overview:', error);
        return [];
    }
};

export const fetchActivityLog = async (): Promise<ActivityLog[]> => {
    try {
        const activityLog = await apiClient.get<ActivityLog[]>('/admin/activity');
        return activityLog;
    } catch (error) {
        console.error('Failed to fetch activity log:', error);
        return [];
    }
};
