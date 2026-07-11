import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchOrders } from '../orders/orderService';
import { Order, OrderStatus } from '../../types';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const myOrders = await fetchOrders();
        setOrders(myOrders);
      } catch (error) {
        console.error("Failed to fetch user orders", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PAID': 
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case 'SHIPPED': 
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'CANCELLED': 
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default: 
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-bold"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-6">
        <img src={user?.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-gray-50" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
          <p className="text-sm text-primary font-medium mt-1 uppercase tracking-wide">{user?.role} Account</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" /> Order History
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't bought anything yet.</p>
            <Link to="/" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Order Placed</span>
                      <span className="font-medium text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Total</span>
                      <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Order ID</span>
                      <span className="font-mono text-gray-600">#{order.id}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div className="p-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-md" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
