import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { fetchProducts } from './productService';
import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';

// Helper to check if a product is from the external API
const isExternalProduct = (product: Product): boolean => {
  // Assuming external products will have a numeric ID from the API,
  // while internal ones might have a different format (e.g., UUID string).
  // A more robust check could be based on a specific property if available.
  return /^\d+$/.test(String(product.id));
};

export const ProductList: React.FC<{ onAddToCart: (p: Product, options?: Record<string, string>) => void }> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch products:", err);
      showToast('Failed to load products. Please try again later.', 'error');
      setLoading(false);
    });
  }, []);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    if (isExternalProduct(product)) {
      // For external products, open their page in a new tab
      window.open(`https://baoba.myspreadshop.com/-sp/p${product.id}`, '_blank');
      return;
    }
    if (product.variants && product.variants.length > 0) {
      showToast('Please select options for this product', 'info');
      navigate(`/product/${product.id}`);
    } else {
      onAddToCart(product);
    }
  };

  const ProductLink: React.FC<{ product: Product; children: React.ReactNode; className?: string }> = ({ product, children, className }) => {
    if (isExternalProduct(product)) {
      // External products link to Spreadshop in a new tab
      return (
        <a
          href={`https://baoba.myspreadshop.com/-sp/p${product.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      );
    }
    // Internal products use React Router's Link
    return <Link to={`/product/${product.id}`} className={className}>{children}</Link>;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <div className="flex gap-2">
          <select className="border-gray-300 rounded-md text-sm cursor-pointer">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const uniqueKey = `${isExternalProduct(product) ? 'ext' : 'int'}-${product.id}`;
          return (
            <div key={uniqueKey} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col">
              <ProductLink product={product} className="block relative h-48 overflow-hidden bg-gray-200 cursor-pointer">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock < 10 && !isExternalProduct(product) && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Low Stock
                  </span>
                )}
              </ProductLink>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs font-medium text-primary uppercase tracking-wider">{product.category}</div>
                  {product.variants && product.variants.length > 0 && (
                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                      {product.variants.length} Options
                    </span>
                  )}
                </div>

                <ProductLink product={product} className="block">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight hover:text-primary transition-colors">{product.name}</h3>
                </ProductLink>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="bg-gray-900 text-white p-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 active:scale-95 transform"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">{isExternalProduct(product) ? 'View' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
