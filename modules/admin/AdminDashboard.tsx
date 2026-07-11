import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';
import { APIConnector } from './APIConnector';
import { ProductManager } from './ProductManager';
import { OrderManager } from './OrderManager';
import { InventoryPricing } from './InventoryPricing';
import { fetchDashboardStats, DashboardStats, fetchRevenueOverview, RevenueDataPoint, fetchActivityLog, ActivityLog } from './adminService';

// Helper to calculate time ago
const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'api' | 'inventory'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardStats().then(setStats);
      fetchRevenueOverview().then(setRevenueData);
      fetchActivityLog().then(setActivityLog);
    }
  }, [activeTab]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your store, APIs, and inventory.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-gray-200 overflow-x-auto">
        <TabButton id="overview" label="Overview" active={activeTab} onClick={setActiveTab} />
        <TabButton id="orders" label="Orders" active={activeTab} onClick={setActiveTab} />
        <TabButton id="products" label="Products" active={activeTab} onClick={setActiveTab} />
        <TabButton id="api" label="API Connectors" active={activeTab} onClick={setActiveTab} />
        <TabButton id="inventory" label="Inventory & Pricing" active={activeTab} onClick={setActiveTab} />
      </div>

      {/* Content Areas */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<DollarSign className="w-6 h-6 text-green-600" />} label="Total Revenue" value={`$${stats?.totalRevenue.toFixed(2) ?? '0.00'}`} trend="+20.1%" />
            <StatCard icon={<Package className="w-6 h-6 text-blue-600" />} label="Total Products" value={stats?.totalProducts.toString() ?? '0'} trend="+5 new" />
            <StatCard icon={<Users className="w-6 h-6 text-purple-600" />} label="Active Users" value={stats?.totalUsers.toString() ?? '0'} trend="+180" />
            <StatCard icon={<ShoppingCart className="w-6 h-6 text-orange-600" />} label="Pending Orders" value={stats?.pendingOrders.toString() ?? '0'} trend="High load" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Charts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue Overview (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">System Activity</h3>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <ActivityItem key={index} text={activity.text} time={timeAgo(new Date(activity.timestamp))} type={activity.type as any} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && <APIConnector />}
      
      {activeTab === 'products' && (
        <div className="animate-fade-in">
          <ProductManager />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="animate-fade-in">
          <OrderManager />
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="animate-fade-in">
          <InventoryPricing />
        </div>
      )}
    </div>
  );
};

const TabButton = ({ id, label, active, onClick }: { id: string, label: string, active: string, onClick: any }) => (
  <button 
    className={`pb-3 px-1 whitespace-nowrap transition-all ${
      active === id 
      ? 'border-b-2 border-primary text-primary font-bold' 
      : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
    }`}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
);

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-green-600 mt-1 font-medium">{trend} from last month</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
  </div>
);

const ActivityItem = ({ text, time, type }: { text: string, time: string, type: 'order'|'system'|'alert'|'user' }) => {
  const getDotColor = () => {
    switch(type) {
      case 'alert': return 'bg-red-500';
      case 'system': return 'bg-blue-500';
      case 'order': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };
  
  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full mt-2 ${getDotColor()}`} />
      <div>
        <p className="text-sm text-gray-700">{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
};
