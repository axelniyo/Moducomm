import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { searchProducts } from './searchService';
import { Product } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../components/hooks/useDebounce';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length > 2) {
        setIsLoading(true);
        setIsOpen(true);
        try {
          const data = await searchProducts(debouncedQuery);
          setResults(data);
        } catch (e) {
          console.error("Search failed", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <div className="relative w-full max-w-xl mx-4" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => debouncedQuery.length > 2 && setIsOpen(true)}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
          {results.map((product) => (
            <div 
              key={product.id} 
              className="p-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-0"
              onClick={() => handleProductClick(product.id)}
            >
              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
              <div>
                <div className="font-medium text-gray-800 text-sm">{product.name}</div>
                <div className="text-xs text-gray-500">${product.price.toFixed(2)} • {product.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && !isLoading && results.length === 0 && debouncedQuery.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 p-4 text-center text-gray-500 text-sm">
          No products found matching "{debouncedQuery}"
        </div>
      )}
    </div>
  );
};
