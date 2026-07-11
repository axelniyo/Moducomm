import React, { useState } from 'react';
import { InventoryLog } from '../../types';
import { TrendingUp, RefreshCw, FileText, Settings, AlertTriangle } from 'lucide-react';

const MOCK_LOGS: InventoryLog[] = [
  { id: '1', timestamp: '10 mins ago', action: 'SYNC', productName: 'API Connector: Electronics', change: 45, details: 'Bulk update from Supplier A' },
  { id: '2', timestamp: '1 hour ago', action: 'SALE', productName: 'Premium Wireless Headphones', change: -1, details: 'Order #ORD-9921' },
  { id: '3', timestamp: '2 hours ago', action: 'RESTOCK', productName: 'Organic Green Tea', change: 100, details: 'Manual Adjustment' },
];

export const InventoryPricing: React.FC = () => {
  const [markup, setMarkup] = useState(25);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pricing Rules Module */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Pricing Rules
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Configure the global markup percentage applied to base supplier prices.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Global Markup (%)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={markup} 
                  onChange={(e) => setMarkup(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-gray-500 font-bold">%</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Supplier Price:</span>
                <span>$100.00</span>
              </div>
              <div className="flex justify-between font-bold text-primary">
                <span>Final Price:</span>
                <span>${(100 * (1 + markup/100)).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
              {isSaving ? 'Updating...' : 'Update Rules'}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Pricing updates will be applied during the next scheduled API sync (every 15 mins).
          </p>
        </div>
      </div>

      {/* Inventory Logs Module */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Inventory Logs
            </h3>
            <button className="text-sm text-primary hover:text-indigo-700 font-medium">Export CSV</button>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold
                      ${log.action === 'SYNC' ? 'bg-blue-100 text-blue-700' : 
                        log.action === 'SALE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{log.productName}
                    <div className="text-xs text-gray-400 font-normal">{log.details}</div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${log.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {log.change > 0 ? '+' : ''}{log.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};