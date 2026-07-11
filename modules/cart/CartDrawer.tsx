import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, CreditCard } from 'lucide-react';
import { CartItem } from '../../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (itemId: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onClearCart }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    onClose(); // Close the drawer
    navigate('/checkout'); // Navigate to checkout page without state
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        <div className="px-4 py-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Cart
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">Your cart is empty.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 animate-fade-in border-b border-gray-100 pb-4 last:border-0">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md border" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <span className="text-sm font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 mt-2"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Subtotal</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
