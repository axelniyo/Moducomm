import React, { useState, useEffect } from 'react';
import { ExternalAPIConfig } from '../../types';
import { Plus, Trash, Link, Power, Settings, ChevronDown, ChevronUp, KeyRound } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { fetchApiConfigs, saveApiConfig, deleteApiConfig, toggleApiConfig } from './apiConnectorService';

const initialFormState: Partial<ExternalAPIConfig> = {
  name: '',
  url: '',
  apiKey: '',
  authHeaderName: 'Authorization', // Default to Authorization
  authHeaderValue: 'Bearer {KEY}', // Default to Bearer token format
  idField: 'id',
  nameField: 'name',
  descriptionField: 'description',
  priceField: 'price',
  categoryField: 'category',
  imageField: 'image',
  stockField: 'stock',
};

export const APIConnector: React.FC = () => {
  const [configs, setConfigs] = useState<ExternalAPIConfig[]>([]);
  const [formState, setFormState] = useState(initialFormState);
  const [isMappingVisible, setIsMappingVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await fetchApiConfigs();
      setConfigs(data);
    } catch (error) {
      showToast('Failed to load API configurations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formState.name || !formState.url) {
      showToast('Please provide both a name and a URL', 'error');
      return;
    }
    try {
      await saveApiConfig(formState);
      setFormState(initialFormState);
      setIsMappingVisible(false);
      showToast('API configuration saved');
      loadConfigs();
    } catch (error) {
      showToast('Failed to save configuration', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        await deleteApiConfig(id);
        showToast('Configuration deleted', 'info');
        loadConfigs();
      } catch (error) {
        showToast('Failed to delete configuration', 'error');
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleApiConfig(id);
      showToast('Live API source updated successfully!', 'success');
      loadConfigs();
    } catch (error) {
      showToast('Failed to update API source', 'error');
    }
  };

  if (loading) {
    return <div>Loading API configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-primary" />
          Connect New Supplier API
        </h3>
        <div className="space-y-4">
          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={formState.name} onChange={handleFormChange} placeholder="e.g., Spreadshop" className="w-full px-4 py-2 border rounded-lg" />
            <input name="url" value={formState.url} onChange={handleFormChange} placeholder="API URL" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          {/* Auth Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <input name="authHeaderName" value={formState.authHeaderName} onChange={handleFormChange} placeholder="Auth Header Name" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="relative md:col-span-2">
              <input name="authHeaderValue" value={formState.authHeaderValue} onChange={handleFormChange} placeholder="Auth Header Value (use {KEY} for the key)" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input name="apiKey" value={formState.apiKey} onChange={handleFormChange} placeholder="API Key" className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>

          <button onClick={() => setIsMappingVisible(!isMappingVisible)} className="text-sm text-primary font-medium flex items-center gap-1">
            <Settings className="w-4 h-4" />
            {isMappingVisible ? 'Hide' : 'Show'} Optional Field Mappings
            {isMappingVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isMappingVisible && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t mt-4 animate-fade-in">
              <MappingInput label="ID Field" name="idField" value={formState.idField!} onChange={handleFormChange} />
              <MappingInput label="Name/Title Field" name="nameField" value={formState.nameField!} onChange={handleFormChange} />
              <MappingInput label="Description Field" name="descriptionField" value={formState.descriptionField!} onChange={handleFormChange} />
              <MappingInput label="Price Field" name="priceField" value={formState.priceField!} onChange={handleFormChange} />
              <MappingInput label="Category Field" name="categoryField" value={formState.categoryField!} onChange={handleFormChange} />
              <MappingInput label="Image URL Field" name="imageField" value={formState.imageField!} onChange={handleFormChange} />
              <MappingInput label="Stock Field" name="stockField" value={formState.stockField!} onChange={handleFormChange} />
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">API Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {configs.map((config) => (
              <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{config.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{config.url}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {config.active ? 'LIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleActive(config.id)}
                      className={`p-2 rounded-full transition-colors ${config.active ? 'text-white bg-green-500 hover:bg-green-600' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`}
                      title={config.active ? 'Deactivate API' : 'Set as Live Source'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(config.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100" title="Delete Configuration">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MappingInput = ({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input name={name} value={value} onChange={onChange} className="w-full px-2 py-1 border rounded-md text-sm" />
  </div>
);
