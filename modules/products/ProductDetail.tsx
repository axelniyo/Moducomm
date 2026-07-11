import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { fetchProductById } from './productService';
import { ShoppingCart, ArrowLeft, CheckCircle, AlertTriangle, Truck, ShieldCheck, Star } from 'lucide-react';
import { useToast } from '../../components/Toast';

interface Props {
  onAddToCart: (p: Product, options?: Record<string, string>) => void;
}

export const ProductDetail: React.FC<Props> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProductById(id).then(data => {
        setProduct(data || null);
        setLoading(false);
        // Reset selections
        setSelectedOptions({});
      });
    }
  }, [id]);

  const handleOptionSelect = (variantName: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Validate all variants are selected
    if (product.variants) {
      const missingVariants = product.variants.filter(v => !selectedOptions[v.name]);
      if (missingVariants.length > 0) {
        showToast(`Please select a ${missingVariants[0].name}`, 'error');
        return;
      }
    }

    onAddToCart(product, selectedOptions);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-xl"></div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">
          Return to store
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100 relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-[400px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Details Section */}
        <div className="p-8 md:p-12 flex flex-col">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to browse
          </button>

          <div className="flex justify-between items-start">
            <div className="uppercase tracking-wide text-xs font-bold text-primary mb-2">
              {product.category}
            </div>
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">4.8</span>
              <span className="text-gray-400">(128 reviews)</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> In Stock ({product.stock})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" /> Out of Stock
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
            {product.description}
          </p>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-6 mb-8">
              {product.variants.map((variant) => (
                <div key={variant.name}>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{variant.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(variant.name, option)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                          ${selectedOptions[variant.name] === option 
                            ? 'border-gray-900 bg-gray-900 text-white shadow-md' 
                            : 'border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                          }
                        `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Truck className="w-4 h-4 text-gray-400" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>2-year warranty included</span>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};